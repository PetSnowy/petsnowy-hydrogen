import {useRef, Suspense} from 'react';
import {Disclosure, Listbox} from '@headlessui/react';
import {
  defer,
  redirect,
  type LoaderFunctionArgs,
  LinksFunction,
} from '@shopify/remix-oxygen';
import {useLoaderData, Await, useLocation, useParams} from '@remix-run/react';
import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {
  AnalyticsPageType,
  Money,
  ShopPayButton,
  VariantSelector,
  getSelectedProductOptions,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import clsx from 'clsx';

import type {
  ProductQuery,
  ProductVariantFragmentFragment,
  VariantsQuery,
} from 'storefrontapi.generated';
import {
  Heading,
  IconCaret,
  IconCheck,
  IconClose,
  ProductGallery,
  ProductSwimlane,
  Section,
  Skeleton,
  Text,
  Link,
  AddToCartButton,
  Button,
} from '~/components';
import {getActiveHeaderHeight, getExcerpt} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import type {Storefront} from '~/lib/type';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';

import {PageRenderer, Video} from '~/components/Common';
import LitterBox from '~/components/product/LitterBox';
import LitterProductVideoImg from '~/assets/product/video-banner-litter-box.png';
import mbLitterProductVideoImg from '~/assets/product/mb_product-video_img.png';
import productStyle from '~/styles/product/index.css';
import ProductPrice from '~/components/product/ProductPrice';

export const headers = routeHeaders;

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: productStyle}];
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
    // throw redirectToFirstVariant({product, request});
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
  return redirect(`${url.pathname}?${searchParams.toString()}`, 302);
}

export default function Product() {
  const {product, shop, variants} = useLoaderData<typeof loader>();
  const {media, title, vendor, descriptionHtml} = product;
  const {shippingPolicy, refundPolicy} = shop;
  const {pathname} = useLocation();

  const componentsMap = new Map([
    [
      '/products/snow-self-cleaning-litter-box',
      [
        <Video
          pcDataSrc="https://cdn.shopify.com/videos/c/o/v/9922252ba3cd4c79aa3c23c6aeb5e46b.mp4"
          pcPoster={LitterProductVideoImg}
          mbDataSrc="https://cdn.shopify.com/videos/c/o/v/8ebcb13e4a354fafb21ac5cee19f6d0d.mp4"
          mbPoster={mbLitterProductVideoImg}
          height={`calc(100vh - ${getActiveHeaderHeight()}px)`}
        />,
        <LitterBox product={product} variants={variants} />,
      ],
    ],
    [
      '*',
      [
        <div className="product-main">
          <div className="container lg:grid items-start lg:grid-cols-5 lg:gap-x-[40px] lg:pt-[40px] lg:pb-[40px] sm:flex sm:flex-wrap sm:gap-y-[20px]">
            <ProductGallery media={media.nodes} />
            <div className="lg:sticky lg:top-[90px] lg:col-start-4 lg:col-end-6">
              <section className="flex flex-col w-full">
                <div className="grid gap-2">
                  {vendor && (
                    <Text className={'opacity-50 font-medium'}>{vendor}</Text>
                  )}
                  <Heading as="h1" className="whitespace-normal">
                    {title}
                  </Heading>
                </div>
                <ProductPrice
                  selectedVariant={product.selectedVariant}
                  className="lg:my-[20px] sm:my-[10px]"
                />
                <Suspense fallback={<ProductForm variants={[]} />}>
                  <Await
                    errorElement="There was a problem loading related products"
                    resolve={variants}
                  >
                    {(resp) => (
                      <ProductForm
                        variants={resp.product?.variants.nodes || []}
                      />
                    )}
                  </Await>
                </Suspense>
                <div className="grid gap-4 py-4">
                  {descriptionHtml && (
                    <ProductDetail
                      title="Product Details"
                      content={descriptionHtml}
                    />
                  )}
                  {shippingPolicy?.body && (
                    <ProductDetail
                      title="Shipping"
                      content={getExcerpt(shippingPolicy.body)}
                      learnMore={`/policies/${shippingPolicy.handle}`}
                    />
                  )}
                  {refundPolicy?.body && (
                    <ProductDetail
                      title="Returns"
                      content={getExcerpt(refundPolicy.body)}
                      learnMore={`/policies/${refundPolicy.handle}`}
                    />
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>,
      ],
    ],
  ]);

  return (
    <>
      <PageRenderer
        pageName={pathname}
        pageComponents={componentsMap}
        excludedPages={['snow-self-cleaning-litter-box']}
      />
      {/* <Suspense fallback={<Skeleton className="h-32" />}>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommended}
        >
          {(products) => (
            <ProductSwimlane title="Related Products" products={products} />
          )}
        </Await>
      </Suspense> */}
    </>
  );
}

export function ProductForm({
  variants,
}: {
  variants: ProductVariantFragmentFragment[];
}) {
  const {product, analytics, storeDomain} = useLoaderData<typeof loader>();

  const closeRef = useRef<HTMLButtonElement>(null);

  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  const selectedVariant = product.selectedVariant!;
  const isOutOfStock = !selectedVariant?.availableForSale;

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  const productAnalytics: ShopifyAnalyticsProduct = {
    ...analytics.products[0],
    quantity: 1,
  };

  return (
    <div className="grid gap-10">
      <div className="grid gap-4">
        <VariantSelector
          handle={product.handle}
          options={product.options}
          variants={variants}
        >
          {({option}) => {
            return (
              <div
                key={option.name}
                className="flex flex-col flex-wrap mb-4 gap-y-2 last:mb-0"
              >
                <Heading as="legend" size="lead" className="min-w-[4rem]">
                  {option.name}
                </Heading>
                <div className="flex flex-wrap items-baseline gap-4">
                  {option.values.length > 7 ? (
                    <div className="relative w-full">
                      <Listbox>
                        {({open}) => (
                          <>
                            <Listbox.Button
                              ref={closeRef}
                              className={clsx(
                                'flex items-center justify-between w-full py-3 px-4 border border-primary',
                                open
                                  ? 'rounded-b md:rounded-t md:rounded-b-none'
                                  : 'rounded',
                              )}
                            >
                              <span>{option.value}</span>
                              <IconCaret direction={open ? 'up' : 'down'} />
                            </Listbox.Button>
                            <Listbox.Options
                              className={clsx(
                                'border-primary bg-contrast absolute bottom-12 z-30 grid h-48 w-full overflow-y-scroll rounded-t border px-2 py-2 transition-[max-height] duration-150 sm:bottom-auto md:rounded-b md:rounded-t-none md:border-t-0 md:border-b',
                                open ? 'max-h-48' : 'max-h-0',
                              )}
                            >
                              {option.values
                                .filter((value) => value.isAvailable)
                                .map(({value, to, isActive}) => (
                                  <Listbox.Option
                                    key={`option-${option.name}-${value}`}
                                    value={value}
                                  >
                                    {({active}) => (
                                      <Link
                                        to={to}
                                        className={clsx(
                                          'text-primary w-full p-2 transition rounded flex justify-start items-center text-left cursor-pointer',
                                          active && 'bg-primary/10',
                                        )}
                                        onClick={() => {
                                          if (!closeRef?.current) return;
                                          closeRef.current.click();
                                        }}
                                      >
                                        {value}
                                        {isActive && (
                                          <span className="ml-2">
                                            <IconCheck />
                                          </span>
                                        )}
                                      </Link>
                                    )}
                                  </Listbox.Option>
                                ))}
                            </Listbox.Options>
                          </>
                        )}
                      </Listbox>
                    </div>
                  ) : (
                    option.values.map(({value, isAvailable, isActive, to}) => (
                      <Link
                        key={option.name + value}
                        to={to}
                        preventScrollReset
                        prefetch="intent"
                        replace
                        className={clsx(
                          'leading-none py-1 border-b-[1.5px] cursor-pointer transition-all duration-200',
                          isActive ? 'border-primary/50' : 'border-primary/0',
                          isAvailable ? 'opacity-100' : 'opacity-50',
                        )}
                      >
                        {value}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          }}
        </VariantSelector>
        {selectedVariant && (
          <div className="grid items-stretch gap-4">
            {isOutOfStock ? (
              <Button variant="secondary" disabled>
                <Text>Sold out</Text>
              </Button>
            ) : (
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: selectedVariant.id!,
                    quantity: 1,
                  },
                ]}
                variant="primary"
                data-test="add-to-cart"
                // analytics={{
                //   products: [productAnalytics],
                //   totalValue: parseFloat(productAnalytics.price),
                // }}
              >
                <Text
                  as="span"
                  className="flex items-center justify-center gap-2"
                >
                  <span>Add to Cart</span>
                  {/* <Money
                    withoutTrailingZeros
                    data={selectedVariant?.price!}
                    as="span"
                  />
                  {isOnSale && (
                    <Money
                      withoutTrailingZeros
                      data={selectedVariant?.compareAtPrice!}
                      as="span"
                      className="opacity-50 strike"
                    />
                  )} */}
                </Text>
              </AddToCartButton>
            )}
            {!isOutOfStock && (
              <ShopPayButton
                width="100%"
                variantIds={[selectedVariant?.id!]}
                storeDomain={storeDomain}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductDetail({
  title,
  content,
  learnMore,
}: {
  title: string;
  content: string;
  learnMore?: string;
}) {
  return (
    <Disclosure key={title} as="div" className="grid w-full gap-2">
      {({open}) => (
        <>
          <Disclosure.Button className="text-left">
            <div className="flex justify-between">
              <Text size="lead" as="h4">
                {title}
              </Text>
              <IconClose
                className={clsx(
                  'transition-transform transform-gpu duration-200',
                  !open && 'rotate-[45deg]',
                )}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className={'pb-4 pt-2 grid gap-2'}>
            <div
              className="prose dark:prose-invert"
              dangerouslySetInnerHTML={{__html: content}}
            />
            {learnMore && (
              <div className="">
                <Link
                  className="pb-px border-b border-primary/30 text-primary/50"
                  to={learnMore}
                >
                  Learn more
                </Link>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
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
