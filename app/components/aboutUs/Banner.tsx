import React from 'react';
import {IconMenu, IconBag} from '../Icon';

export default function Banner() {
  return (
    <div>
      <button className="w-[30px] h-[40px]">
        <IconMenu />
      </button>
      <button className="w-[30px] h-[40px]">
        <IconBag />
      </button>
    </div>
  );
}
