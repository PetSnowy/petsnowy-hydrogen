import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense, useLayoutEffect, useRef, useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import Swiper from '~/components/Swiper';
import {Video} from '~/components/Common';
import pcIndexVideoPoster from '~/assets/index/index-video-poster.png';
import mbIndexVideoPoster from '~/assets/index/mb-index-video-poster.png';
import LitterProduct from '~/components/index/LitterProduct';
import indexStyle from '~/styles/index/index.css';
import {getActiveHeaderHeight} from '~/utils';
import ActiveBar from '~/components/index/ActiveBar';
export const meta: MetaFunction<typeof loader> = ({data}: {data: any}) => {
  const {
    shop: {description, name},
  } = data;
  return [{title: `${name ?? ''}`}, {description: `${description ?? ''}`}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  const {shop} = await storefront.query(GET_SHOP_INFO);
  return defer({featuredCollection, recommendedProducts, shop});
}

export function links() {
  return [{rel: 'stylesheet', href: indexStyle}];
}

export default function Homepage() {
  // const {featuredCollection, recommendedProducts} = useLoaderData<
  //   typeof loader
  // >() as any;

  const top = 300;

  return (
    <div className="home">
      <Video
        pcDataSrc="https://cdn.shopify.com/videos/c/o/v/85c7ad8fc6e74e3fa6f8961f103ba778.mp4"
        pcPoster={pcIndexVideoPoster}
        mbDataSrc="https://cdn.shopify.com/videos/c/o/v/1746fd8ffc9248a78d697693f1f94958.mp4"
        mbPoster={mbIndexVideoPoster}
        height={getActiveHeaderHeight()}
      />
      <ActiveBar />
      <LitterProduct top={top} />

      {/* <FeaturedCollection collection={featuredCollection} />
      <RecommendedProducts products={recommendedProducts} /> */}
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const GET_SHOP_INFO = `#graphql
query shop {
  shop {
    description
    name
    id
  }
}
` as const;

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
