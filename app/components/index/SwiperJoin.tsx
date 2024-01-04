import React from 'react';
import {SwiperSlide, Swiper, SwiperRef} from 'swiper/react';
import {LazyImage} from '../Common';
import {Autoplay, Navigation} from 'swiper/modules';
import {handleResize} from '~/lib/utils';

const data = [
  {
    pcImg: require('~/assets/index/swiper-join-1.png'),
    mbImg: require('~/assets/index/mb-swiper-join-1.png'),
    alt: 'petsnowy',
  },
  {
    pcImg: require('~/assets/index/swiper-join-2.png'),
    mbImg: require('~/assets/index/mb-swiper-join-2.png'),
    alt: 'petsnowy',
  },
  {
    pcImg: require('~/assets/index/swiper-join-3.png'),
    mbImg: require('~/assets/index/mb-swiper-join-3.png'),
    alt: 'petsnowy',
  },
  {
    pcImg: require('~/assets/index/swiper-join-4.png'),
    mbImg: require('~/assets/index/mb-swiper-join-4.png'),
    alt: 'petsnowy',
  },
  {
    pcImg: require('~/assets/index/swiper-join-5.png'),
    mbImg: require('~/assets/index/mb-swiper-join-5.png'),
    alt: 'petsnowy',
  },
  {
    pcImg: require('~/assets/index/swiper-join-6.png'),
    mbImg: require('~/assets/index/mb-swiper-join-6.png'),
    alt: 'petsnowy',
  },
  {
    pcImg: require('~/assets/index/swiper-join-7.png'),
    mbImg: require('~/assets/index/mb-swiper-join-7.png'),
    alt: 'petsnowy',
  },
  {
    pcImg: require('~/assets/index/swiper-join-8.png'),
    mbImg: require('~/assets/index/mb-swiper-join-8.png'),
    alt: 'petsnowy',
  },
];
export default function SwiperJoin() {
  const isMobile = handleResize();
  return (
    <div className="swiper-join bg-[#e0d5c1] text-[#504030] lg:pt-[60px] lg:pb-[65px]">
      <div className="container flex items-center flex-wrap justify-center sm:flex-col">
        <p className="font-LeagueSpartanBlack lg:mb-[48px] text-center lg:text-[70px] first-letter:text-[#d75f23]">
          Join 30,000+ happy pet parents
        </p>
        <div className="swiper-container lg:w-[1200px] relative">
          <Swiper
            slidesPerView={isMobile ? 'auto' : 4}
            spaceBetween={isMobile ? 20 : 40}
            modules={[Navigation, Autoplay]}
            autoplay={{delay: 3000}}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            loop
          >
            {data.length &&
              data.map(({pcImg, mbImg, alt}, index) => (
                <SwiperSlide key={index}>
                  <LazyImage
                    alt={alt}
                    pcImg={pcImg}
                    mobileImg={mbImg}
                    className="block w-full select-none"
                    lazy={false}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
          {!isMobile ? (
            <>
              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
