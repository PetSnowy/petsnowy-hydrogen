import React, {useState} from 'react';
import classicProductImg from '~/assets/product/classic_product.png';
import classicShowImg from '~/assets/product/classic_show.png';
import creamProductImg from '~/assets/product/white_product.png';
import creamShowImg from '~/assets/product/white_show.png';
import {LazyImage} from '../Common';

const selectColor = [
  {name: 'Classic', classicProductImg, classicShowImg},
  {name: 'Creams', creamProductImg, creamShowImg},
];

export default function LitterBox() {
  const [selectColorIndex, setSelectColorIndex] = useState(0);
  return (
    <div className="LitterBox">
      <div className="container flex">
        <div className="show-box">
          <div className="img-wrapper w-1px">
            <LazyImage
              pcImg={selectColor[selectColorIndex].classicShowImg}
              alt={selectColor[selectColorIndex].name}
            />
          </div>
        </div>
        <div className="select-product"></div>
      </div>
    </div>
  );
}
