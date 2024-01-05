import React from 'react';
import MouseMove from '../MouseMove';
import {LazyImage} from '~/components/Common';
import productSafety from '~/assets/product/product-safety.png';
import mbProductSafety from '~/assets/product/mb-product-safety.png';

export default function ProductInventory() {
  return (
    <div className="product-inventory bg-[#e9e0cf] lg:py-[88px]">
      <div className="container">
        <MouseMove xRange={[-5, 5]} yRange={[-5, 5]}>
          <LazyImage
            alt="petsnowy"
            pcImg={productSafety}
            mobileImg={mbProductSafety}
          />
        </MouseMove>
      </div>
    </div>
  );
}
