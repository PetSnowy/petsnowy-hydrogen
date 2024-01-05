import React from 'react';
import inventory from '~/assets/index/inventory.png';
import mbInventory from '~/assets/index/mb-inventory.png';
import {LazyImage} from '../Common';
import {Link} from '../Link';

export default function Inventory() {
  return (
    <div className="inventory lg:pt-[80px] lg:pb-[100px] bg-[#e9e0cf]">
      <div className="container relative">
        <LazyImage alt="petsnowy" pcImg={inventory} mobileImg={mbInventory} />
        <Link
          to={'/products/snow-self-cleaning-litter-box'}
          prefetch="intent"
          className="absolute lg:right-[48px] flex items-center justify-center uppercase lg:hover:text-[#504030] lg:hover:bg-white transition lg:bottom-[48px] font-LeagueSpartanBlack lg:rounded-[39px] lg:text-[36px] text-white bg-[#504030] lg:w-[314px] lg:h-[79px]"
        >
          Order Now
        </Link>
      </div>
    </div>
  );
}
