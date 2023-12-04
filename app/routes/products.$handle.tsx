import {Fragment, ReactNode, Suspense} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  Link,
  useLoaderData,
  type MetaFunction,
  type FetcherWithComponents,
  useLocation,
} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantsQuery,
  ProductVariantFragment,
} from 'storefrontapi.generated';

import {Image, getSelectedProductOptions} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/utils';
import LitterBox from '~/components/product/LitterBox';
import {PageRenderer, Video} from '~/components/Common';
import LitterBoxStyle from '~/styles/product/litter-box.css';
import LitterProductVideoImg from '~/assets/product/video-banner-litter-box.png';
import mbLitterProductVideoImg from '~/assets/product/mb_product-video_img.png';
import {getActiveHeaderHeight} from '~/utils';
import {ProductForm, ProductPrice} from '~/components/product/ProductCommon';

export function links() {
  return [{rel: 'stylesheet', href: LitterBoxStyle}];
}
export const meta: MetaFunction<typeof loader> = ({data}: {data: any}) => {
  return [
    {title: `${data?.product.seo.title ?? ''}`},
    {description: `${data?.product.seo.description ?? ''}`},
  ];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    if (!product.selectedVariant) {
      // throw redirectToFirstVariant({product, request});
    }
  }
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  return defer({product, variants});
}
// 默认选中第一个变体
// function redirectToFirstVariant({
//   product,
//   request,
// }: {
//   product: ProductFragment;
//   request: Request;
// }) {
//   const url = new URL(request.url);
//   const firstVariant = product.variants.nodes[0];

//   return redirect(
//     getVariantUrl({
//       pathname: url.pathname,
//       handle: product.handle,
//       selectedOptions: firstVariant.selectedOptions,
//       searchParams: new URLSearchParams(url.search),
//     }),
//     {
//       status: 302,
//     },
//   );
// }

export default function Product() {
  const {product, variants} = useLoaderData<typeof loader>() as any;
  const {selectedVariant} = product;
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
          height={getActiveHeaderHeight()}
        />,
        <LitterBox product={product} variants={variants} />,
      ],
    ],
    [
      '*',
      [
        <div className="product-main">
          <ProductImage image={selectedVariant?.image} />
          <ProductMain
            selectedVariant={selectedVariant}
            product={product}
            variants={variants}
          />
        </div>,
      ],
    ],
  ]);

  return (
    <div className="product">
      <PageRenderer
        pageName={pathname}
        pageComponents={componentsMap}
        excludedPages={['/products/snow-self-cleaning-litter-box']}
      />
    </div>
  );
}

function ProductImage({image}: {image: ProductVariantFragment['image']}) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="product-image">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </div>
  );
}

function ProductMain({
  selectedVariant,
  product,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
}) {
  const {title, descriptionHtml} = product;
  return (
    <div className="product-main">
      <h1>{title}</h1>
      <ProductPrice selectedVariant={selectedVariant} />
      <br />
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
            />
          )}
        </Await>
      </Suspense>
      <br />
      <br />
      <p>
        <strong>Description</strong>
      </p>
      <br />
      <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      <br />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
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
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
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
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;

const getProductSeo = `#graphql query Product {
  product(handle: "snow-self-cleaning-litter-box") {
    seo {
      title
      description
    }
    title
  }
}` as const;
