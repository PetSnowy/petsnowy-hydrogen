import {SwiperSlide, Swiper, SwiperRef} from 'swiper/react';
import {LazyImage, Video} from '../Common';
import {useEffect, useRef, useState} from 'react';
import {Mousewheel, Pagination} from 'swiper/modules';

export type Data = {
  pcImg: string;
  mbImg: string;
  url: string;
  alt: string;
};

export default function SwiperVideo({data}: {data: Data[]}) {
  const [show, setShow] = useState<boolean>(false);
  const [showVideoIndex, setShowVideoIndex] = useState<number>(0);
  const swiperVideo = useRef<SwiperRef | null>(null);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement[] | null>(null);

  useEffect(() => {}, []);

  const handleIndex = (index: number) => {
    setShow(true);
    const swiper = swiperVideo.current?.swiper;
    if (!swiper) return;

    setVideoEl(
      swiper?.slides.map(
        (item) => item.querySelector('video') as HTMLVideoElement,
      ),
    );
    swiper?.slideTo(index);
    setShowVideoIndex(swiper.activeIndex!);
  };

  const handleClose = () => {
    setShow(false);
    if (videoEl) {
      closeVideo(videoEl);
    }
  };

  const onSlideChange = () => {
    // closeVideo(videoEl!);
    const index = swiperVideo.current?.swiper.activeIndex;
  };

  const closeVideo = (data: HTMLVideoElement[]) => {
    data.forEach((item) => item.pause());
  };

  return (
    <div className="swiper-video bg-[#e9e0cf] pb-[94px]">
      <div className="container lg:p-[40px] bg-[#f6f3ec] lg:rounded-[36px] flex items-center justify-between lg:gap-x-[40px]">
        <div className="word flex-shrink-0"></div>
        <div className="content">
          <Swiper slidesPerView="auto" spaceBetween={20}>
            {data.length &&
              data.map(({pcImg, mbImg, alt}, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="img-wrapper"
                    onClick={() => handleIndex(index)}
                  >
                    <LazyImage
                      alt={alt}
                      pcImg={pcImg}
                      mobileImg={mbImg}
                      className="block lg:w-[139px] lg:h-[170px]"
                      lazy={false}
                    />
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
      <div className={`video-container fixed ${show ? 'block' : 'hidden'}`}>
        <div className="close absolute" onClick={handleClose}></div>
        <Swiper
          modules={[Pagination, Mousewheel]}
          slidesPerView={1}
          spaceBetween={10}
          direction="vertical"
          grabCursor
          mousewheel={true}
          pagination={{clickable: true}}
          onSlideChange={onSlideChange}
          ref={swiperVideo}
        >
          <div className="video-wrapper">
            {data.length &&
              data.map(({url}, index) => (
                <SwiperSlide key={index}>
                  <Video pcDataSrc={url} controls={true} />
                </SwiperSlide>
              ))}
          </div>
        </Swiper>
      </div>
    </div>
  );
}
