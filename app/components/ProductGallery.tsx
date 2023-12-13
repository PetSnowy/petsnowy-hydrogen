import {Navigation, Pagination, Thumbs, Autoplay} from 'swiper/modules';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import type {MediaFragment} from 'storefrontapi.generated';
import {useEffect, useRef, useState} from 'react';
import {type Swiper as SwiperType} from 'swiper';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({
  media,
  className,
}: {
  media: MediaFragment[];
  className?: string;
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType>();
  return (
    <div
      className={`lg:grid-flow-row lg:grid-cols-2 lg:col-start-1 lg:col-end-4 w-[100%] ${className} flex gap-y-[20px] flex-wrap `}
    >
      {media.length && (
        <>
          <Swiper
            modules={[Navigation, Autoplay, Pagination, Thumbs]}
            spaceBetween={20}
            slidesPerView={1}
            autoHeight={true}
            navigation
            thumbs={thumbsSwiper ? {swiper: thumbsSwiper} : undefined}
          >
            {media.map((item, index) => (
              <SwiperSlide key={index}>
                <img
                  src={item.previewImage?.url}
                  alt={item.alt ? item.alt : ''}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {media.length > 1 && (
            <Swiper
              modules={[Thumbs]}
              watchSlidesProgress
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              onSwiper={(swiper) => setThumbsSwiper(swiper)}
            >
              {media.map((item, index) => (
                <SwiperSlide key={index}>
                  <img
                    className="w-[100px] h-auto object-contain m-auto"
                    src={item.previewImage?.url}
                    alt={item.alt ? item.alt : ''}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </>
      )}
    </div>
  );
}
