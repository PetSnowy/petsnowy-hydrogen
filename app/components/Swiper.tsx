// import Swiper core and required modules
import {Navigation, Pagination, Scrollbar, A11y} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.css';

type Swiper = {
  spaceBetween?: number;
  slidesPerView?: number;
  swiperData: Array<string>;
};
export default ({spaceBetween = 50, slidesPerView = 3, swiperData}: Swiper) => {
  return (
    <Swiper
      modules={[Pagination, Scrollbar]}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
    >
      {swiperData.map((item, index) => (
        <SwiperSlide key={index}>{item}</SwiperSlide>
      ))}
    </Swiper>
  );
};
