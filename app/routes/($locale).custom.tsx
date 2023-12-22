import {
  type LoaderFunctionArgs,
  LinksFunction,
  defer,
} from '@shopify/remix-oxygen';
import {LazyImage} from '~/components/Common';
import defaultImg from '~/assets/product/classic_show.png';
import cartStyle from '~/styles/custom/index.css';
import {MEDIA_FRAGMENT} from '~/data/fragments';
import {getSelectedProductOptions} from '@shopify/hydrogen';
import {FILTER_URL_PREFIX} from '~/components/SortFilter';
import Aside from '~/components/custom/Aside';
import {useEffect, useState} from 'react';
import store from '~/components/custom/store';
import {IconFreight, IconTrial, IconWarranty} from '~/components/Icon';
import {ProductFilter} from '@shopify/hydrogen/storefront-api-types';

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: cartStyle}];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const searchParams = new URL(request.url).searchParams;
  const productHandle =
    searchParams.get('product') ?? 'snow-self-cleaning-litter-box';

  // 获取选中的变体
  const selectedOptions = getSelectedProductOptions(request);
  //获取产品消息
  const {shop, product} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
      selectedOptions,
    },
  });
  // 获取当前产品的变体
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: productHandle,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });
  // 获取当前产品的变体描述详情

  // 获取addons产品
  const addOnsId = await storefront.query(GET_METAFIELD_LIST, {
    cache: storefront.CacheLong(),
    variables: {
      productHandle,
      metafieldKey: 'addons_product',
      metafieldNamespace: 'custom',
    },
  });
  // 获取产品系列

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle: 'snow',
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  //获取addons产品的handle
  const metafieldAddOnsList: any = JSON.parse(addOnsId.product.metafield.value);

  const addOnsListHandle = await Promise.all(
    metafieldAddOnsList.map(async (item: string) => {
      const result = await storefront.query(GET_PRODUCT_DETAILS, {
        cache: storefront.CacheLong(),
        variables: {
          id: item,
        },
      });
      return result;
    }),
  );
  // 获取addons 的变体
  const addOnsList = await Promise.all(
    addOnsListHandle.map(async (item) => {
      const result = storefront.query(VARIANTS_QUERY, {
        variables: {
          handle: item.product.handle,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
      });
      return result;
    }),
  );
  return defer({
    addOnsList,
    product,
    shop,
    variants,
    collection,
  });
}

const strategy = [
  {name: 'US Free Delivery Over $49', img: <IconFreight />},
  {name: '30-Day Home Trial', img: <IconTrial />},
  {name: '12-Month Warranty', img: <IconWarranty />},
];

export default function customRouter() {
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = store.subscribe(() =>
      setImgUrl(store.getState().selectedOptions.productImg),
    );
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-[#ece2da] w-[100%] lg:grid lg:grid-cols-3 cart-wrapper">
      <div className="cart lg:col-start-1 lg:col-end-3 flex items-center justify-center">
        <div className="cart-left overflow-hidden grid flex-col flex-wrap grid-rows-8 grid-cols-1 w-full h-full">
          <div className="cart-img bg-white w-full h-full lg:rounded-[20px] overflow-hidden row-start-1 row-end-5 flex items-center justify-center lg:max-w-[870px] lg:max-h-[570px] m-auto">
            <LazyImage
              alt="petsnowy"
              pcImg={imgUrl ?? defaultImg}
              className="object-contain w-full h-full block lg:rounded-[20px]"
            />
          </div>

          <div className="strategy flex m-auto row-start-7 row-start-8 lg:max-w-[870px] lg:gap-x-[80px]">
            {strategy.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center lg:gap-y-[10px]"
              >
                {item.img}
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Aside />
    </div>
  );
}

const GET_METAFIELD_LIST = `
  query GetGiftList($productHandle: String!, $metafieldKey: String!, $metafieldNamespace: String!) {
    product(handle: $productHandle) {
      metafield(key: $metafieldKey, namespace: $metafieldNamespace) {
        id
        key
        value
      }
    }
  }
` as const;

const GET_PRODUCT_DETAILS = `
query GetProductDetails	($id: ID!){
	product(id: $id) {
		handle
		id
    featuredImage {
      url
    }
		priceRange {
			maxVariantPrice {
				amount
				currencyCode
			}
			minVariantPrice {
				amount
				currencyCode
			}
		}
		variants(first: 10){
			edges {
        node {
          id
        }
      }
		}
	}
}
`;

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        ...ProductVariantFragment
      }
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  query variants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      variants(first: 250) {
        nodes {
          ...ProductVariantFragment
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANT_DESCRIPTION_QUERY = `#graphql
fragment ProductVariant on ProductVariant {
  metafield(key: 'variant_description', namespace: 'custom') {
    id
    key
    value
  }
  id
  image {
    ...Image
  }
  price {
    ...Money
  }
  product {
    handle
  }
  sku
  title
}
`;

const COLLECTION_QUERY = `#graphql
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle){
      products(first: 10) {
        edges {
          node {
            availableForSale
            handle
            id
            title
            variants(first: 1) {
              edges {
                node {
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  sku
                  title
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
` as const;
