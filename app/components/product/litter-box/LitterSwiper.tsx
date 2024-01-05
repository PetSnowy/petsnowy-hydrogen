import {Navigation, Pagination, Autoplay} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import {LazyImage} from '~/components/Common';

const swiperData = [
  {
    pcImg: require('~/assets/product/product-swiper-1.png'),
    mbImg: require('~/assets/product/mb-product-swiper-1.png'),
    alt: 'petsnowy',
  },
  {
    pcImg: require('~/assets/product/product-swiper-2.png'),
    mbImg: require('~/assets/product/mb-product-swiper-2.png'),
    alt: 'petsnowy',
  },
  {
    pcImg: require('~/assets/product/product-swiper-3.png'),
    mbImg: require('~/assets/product/mb-product-swiper-3.png'),
    alt: 'petsnowy',
  },
  {
    pcImg: require('~/assets/product/product-swiper-4.png'),
    mbImg: require('~/assets/product/mb-product-swiper-4.png'),
    alt: 'petsnowy',
  },
  {
    pcImg: require('~/assets/product/product-swiper-5.png'),
    mbImg: require('~/assets/product/mb-product-swiper-5.png'),
    alt: 'petsnowy',
  },
];
export default function LitterSwiper() {
  return (
    <div className="litter-swiper bg-[#e0d6c1] lg:pt-[70px] lg:pb-[53px]">
      <div className="container relative">
        <p className="absolute font-HelveticaNowDisplayXBlk first-letter:text-[#D75F23] lg:text-[69px] block lg:w-[543px] lg:h-[135px] text-[#504030] lg:left-[504px] lg:top-[100px] lg:leading-[60px]">
          Cat care at your fingertips.
        </p>
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          autoHeight={true}
          autoplay={{delay: 5000}}
          navigation
          loop
        >
          {swiperData.map(({pcImg, mbImg, alt}, index) => (
            <SwiperSlide key={index}>
              <LazyImage
                alt={alt}
                pcImg={pcImg}
                mobileImg={mbImg}
                lazy={false}
                className="select-none"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
