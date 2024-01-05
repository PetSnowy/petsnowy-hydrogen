import {
  defer,
  redirect,
  type LoaderFunctionArgs,
  LinksFunction,
} from '@shopify/remix-oxygen';
import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {AnalyticsPageType, getSelectedProductOptions} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import type {ProductQuery} from 'storefrontapi.generated';
import {seoPayload} from '~/lib/seo.server';
import type {Storefront} from '~/lib/type';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import litterBoxStyle from '~/styles/product/litter-box.css';
import ProductMap from '~/components/product/ProductMap';

export const headers = routeHeaders;

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: litterBoxStyle}];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const {shop, product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }

  if (!product.selectedVariant) {
    throw redirectToFirstVariant({product, request});
  }

  const variants = context.storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: productHandle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  const recommended = getRecommendedProducts(context.storefront, product.id);

  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  const seo = seoPayload.product({
    product,
    selectedVariant,
    url: request.url,
  });

  const getLitterProduct = await litterLoader(
    productHandle,
    context.storefront,
  );

  return defer({
    variants,
    product,
    shop,
    productHandle,
    storeDomain: shop.primaryDomain.url,
    recommended,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: parseFloat(selectedVariant.price.amount),
    },
    seo,
    ...getLitterProduct,
  });
}

// 获取猫砂盆配件
async function litterLoader(handle: string, storefront: Storefront) {
  if (handle !== 'snow-self-cleaning-litter-box') return;
  // 获取gift产品id
  const giftId = await storefront.query(GET_METAFIELD_LIST, {
    cache: storefront.CacheLong(),
    variables: {
      productHandle: handle,
      metafieldKey: 'gift',
      metafieldNamespace: 'custom',
    },
  });

  const metafieldGiftList: any = JSON.parse(giftId.product.metafield.value);

  // 使用gift产品id获取产品详情
  const giftList = await Promise.all(
    metafieldGiftList.map(async (item: string) => {
      const result = await storefront.query(GET_PRODUCT_DETAILS, {
        cache: storefront.CacheLong(),
        variables: {
          id: item,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
      });
      return result;
    }),
  );

  // 获取addons产品
  const addOnsId = await storefront.query(GET_METAFIELD_LIST, {
    cache: storefront.CacheLong(),
    variables: {
      productHandle: handle,
      metafieldKey: 'addons_product',
      metafieldNamespace: 'custom',
    },
  });

  const metafieldAddOnsList: any = JSON.parse(addOnsId.product.metafield.value);

  const addOnsListHandle = await Promise.all(
    metafieldAddOnsList.map(async (item: string) => {
      const result = await storefront.query(GET_PRODUCT_DETAILS, {
        cache: storefront.CacheLong(),
        variables: {
          id: item,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
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
  return {giftList, metafieldGiftList, addOnsList};
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductQuery['product'];
  request: Request;
}) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams();
  const firstVariant = product!.variants.nodes[0];
  for (const option of firstVariant.selectedOptions) {
    searchParams.set(option.name, option.value);
  }
  return redirect(`${url.pathname}?${searchParams.toString()}`);
}

export default function Product() {
  return <ProductMap />;
}

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

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
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
query GetProductDetails	($id: ID!
  $country: CountryCode
  $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
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
