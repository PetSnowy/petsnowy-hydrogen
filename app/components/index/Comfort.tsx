import React from 'react';
import our from '~/assets/index/our.png';
import mbOur from '~/assets/index/mb-our.png';
import {LazyImage} from '../Common';
import {Link} from '../Link';

export default function Comfort() {
  return (
    <div className="comfort bg-[#e9e0cf] lg:py-[95px]">
      <div className="container relative">
        <LazyImage
          alt="petsnowy"
          pcImg={our}
          mobileImg={mbOur}
          className="lg:rounded-[50px]"
        />
        <Link
          to={'/pages/about-us'}
          prefetch="intent"
          className="bg-[#96816b] text-white flex items-center justify-center absolute lg:left-[156px] lg:bottom-[110px] lg:w-[286px] lg:h-[54px] lg:rounded-[25px]"
        >
          <span className="font-LeagueSpartanBold lg:text-[30px]">
            OUR STORY
          </span>
          <i></i>
        </Link>
      </div>
    </div>
  );
}
