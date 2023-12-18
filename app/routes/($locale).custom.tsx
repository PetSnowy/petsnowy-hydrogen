import {
  type LoaderFunctionArgs,
  json,
  LinksFunction,
  defer,
} from '@shopify/remix-oxygen';
import {LazyImage} from '~/components/Common';
import {getActiveHeaderHeight} from '~/lib/utils';
import defaultImg from '~/assets/product/classic_show.png';
import cartStyle from '~/styles/custom/index.css';
import {MEDIA_FRAGMENT} from '~/data/fragments';
import {getSelectedProductOptions} from '@shopify/hydrogen';
import Aside from '~/components/custom/Aside';
import {useEffect, useState} from 'react';
import store from '~/components/custom/store';

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: cartStyle}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const productHandle =
    new URL(request.url).searchParams.get('product') ??
    'snow-self-cleaning-litter-box';

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
  // 获取addons产品
  const addOnsId = await storefront.query(GET_METAFIELD_LIST, {
    cache: storefront.CacheLong(),
    variables: {
      productHandle,
      metafieldKey: 'addons_product',
      metafieldNamespace: 'custom',
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
  });
}

export default function customRouter() {
  const [imgUrl, setImgUrl] = useState<string>(defaultImg);
  useEffect(() => {
    store.subscribe(() =>
      setImgUrl(store.getState().selectedOptions.productImg),
    );
  }, [imgUrl]);
  return (
    <div
      className="bg-[#ece2da] w-[100%] lg:grid lg:grid-cols-3"
      style={{height: `calc(100vh - ${getActiveHeaderHeight()}px)`}}
    >
      <div className="cart lg:col-start-1 lg:col-end-3 flex items-center justify-center lg:p-[20px]">
        <div className="lg:rounded-[20px] overflow-hidden bg-white">
          <LazyImage
            alt="petsnowy"
            pcImg={imgUrl}
            className="object-contain lg:h-[600px]"
          />
          <div className=""></div>
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
