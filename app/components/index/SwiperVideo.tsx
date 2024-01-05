import {SwiperSlide, Swiper, SwiperRef} from 'swiper/react';
import {LazyImage, Video} from '../Common';
import {useRef, useState} from 'react';
import {Mousewheel, Pagination} from 'swiper/modules';
import type SwiperType from 'swiper';
import {handleResize} from '~/lib/utils';
import '~/styles/index/swiper-video.css';

export type Data = {
  pcImg: string;
  mbImg: string;
  url: string;
  alt: string;
};

export default function SwiperVideo({data}: {data: Data[]}) {
  const [show, setShow] = useState<boolean>(false);
  const [showVideoIndex, setShowVideoIndex] = useState<number>(-1);
  const swiperVideo = useRef<SwiperRef | null>(null);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement[] | null>(null);
  const isMobile = handleResize();

  const handleIndex = (index: number) => {
    if (index === showVideoIndex) return;
    const swiper = swiperVideo.current!.swiper;
    const videoList = swiper.el.querySelectorAll('video');
    setShow(true);
    setVideoEl(Array.from(videoList));
    swiper?.slideTo(index);
    setShowVideoIndex(index);
  };

  const handleClose = () => {
    setShow(false);
    if (!videoEl) return;
    closeVideo(videoEl);
  };

  const onSlideChange = (value: SwiperType) => {
    if (!videoEl) return;
    const activeIndex = value.activeIndex;
    videoEl[value.previousIndex].pause();
    videoEl[activeIndex].addEventListener('canplay', () => {
      videoEl[activeIndex].play();
    });
    setShowVideoIndex(activeIndex);
  };

  const closeVideo = (data: HTMLVideoElement[]) => {
    data.forEach((item) => item.pause());
  };

  return (
    <div className="swiper-video bg-[#e9e0cf] lg:pb-[94px]">
      <div className="container lg:p-[40px] bg-[#f6f3ec] lg:rounded-[36px] flex items-center justify-between lg:gap-x-[40px]">
        <div className="word flex-shrink-0"></div>
        <div className="content">
          <Swiper slidesPerView="auto" spaceBetween={isMobile ? 10 : 20}>
            {data.length &&
              data.map(({pcImg, mbImg, alt}, index) => (
                <SwiperSlide key={index} onClick={() => handleIndex(index)}>
                  <LazyImage
                    alt={alt}
                    pcImg={pcImg}
                    mobileImg={mbImg}
                    className="block lg:w-[139px] lg:h-[170px]"
                    lazy={false}
                  />
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
          allowTouchMove
        >
          <div className="video-wrapper">
            {data.length &&
              data.map(({url}, index) => (
                <SwiperSlide key={index}>
                  <Video pcDataSrc={url} controls={true} className="video" />
                </SwiperSlide>
              ))}
          </div>
        </Swiper>
      </div>
    </div>
  );
}
