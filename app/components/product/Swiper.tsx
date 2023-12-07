// import Swiper core and required modules
import {useEffect, useState} from 'react';
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

type Swiper = {
  spaceBetween?: number;
  slidesPerView?: number;
  swiperData: Array<string>;
};
export default ({spaceBetween = 50, slidesPerView = 3, swiperData}: Swiper) => {
  const [pagination, setPagination] = useState<boolean>(false);

  useEffect(() => {
    window.innerWidth < 900 ? setPagination(true) : setPagination(false);
  }, []);

  return (
    <Swiper
      modules={[Navigation, Autoplay, Pagination]}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      autoHeight={true}
      autoplay={{delay: 5000}}
      navigation
      loop
      pagination={pagination}
    >
      {swiperData.map((item, index) => (
        <SwiperSlide key={index}>
          <img loading="lazy" decoding="async" src={item} alt="petsnowy" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
