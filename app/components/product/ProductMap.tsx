import {Suspense} from 'react';
import {useLoaderData, Await, useLocation} from '@remix-run/react';
import {Heading, ProductGallery, Text} from '~/components';
import {getActiveHeaderHeight, getExcerpt} from '~/lib/utils';
import {LazyImage, PageRenderer, Video} from '~/components/Common';
import LitterBox from '~/components/product/litter-box/LitterBox';
import LitterProductVideoImg from '~/assets/product/video-banner-litter-box.png';
import mbLitterProductVideoImg from '~/assets/product/mb_product-video_img.png';
import ProductPrice from '~/components/product/ProductPrice';
import SwiperVideo from '~/components/index/SwiperVideo';
import ProductLitter from '~/components/product/litter-box/ProductLitter';
import LitterSwiper from '~/components/product/litter-box/LitterSwiper';
import {loader} from '~/routes/($locale).products.$productHandle';
import {swiperVideoData} from '~/routes/($locale)._index';
import ProductForm from './ProductForm';
import ProductDetail from './ProductDetail';
import ProductInventory from './litter-box/ProductInventory';
import Quiet from './litter-box/Quiet';
import specsImg from '~/assets/product/specs.png';
import mbSpecsImg from '~/assets/product/mb_specs.png';

export default function ProductMap() {
  const {product, variants, shop} = useLoaderData<typeof loader>();
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
        <SwiperVideo data={swiperVideoData} />,
        <ProductLitter />,
        <LitterSwiper />,
        <ProductInventory />,
        <Quiet />,
        <div className="specs bg-[#e9e0cf]">
          <div className="container">
            <LazyImage pcImg={specsImg} alt="specs" mobileImg={mbSpecsImg} />
          </div>
        </div>,
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
    <PageRenderer
      pageName={pathname}
      pageComponents={componentsMap}
      excludedPages={['snow-self-cleaning-litter-box']}
    />
  );
}
