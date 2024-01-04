import React from 'react';
import {handleResize} from '~/lib/utils';
import reported from '~/assets/index/reported.png';
import {LazyImage} from '../Common';

export default function Reported() {
  const isMobile = handleResize();
  return isMobile ? (
    <></>
  ) : (
    <div className="py-[20px] flex items-center justify-center bg-[#e0d5c1]">
      <LazyImage alt="petsnowy" pcImg={reported} className="w-[489px]" />
    </div>
  );
}
