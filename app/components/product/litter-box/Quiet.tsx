import React from 'react';
import {LazyImage} from '~/components/Common';
import quiteImg from '~/assets/product/quite.png';
import mbQuiteImg from '~/assets/product/mb-quite.png';

export default function Quiet() {
  const line = new Array(20).fill(1);
  return (
    <div className="product-quiet bg-[#e9e0cf] lg:pb-[75px]">
      <div className="container">
        <div className="content">
          <div
            className="title-wrapper aos-init aos-animate"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <p className="quiet-title">Whisper Quiet</p>
            <span className="quiet-title">Joy and only joy</span>
          </div>
          <div
            className="voice aos-init aos-animate"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <div className="icon"></div>
            <div className="wrapper">
              <div className="line">
                {line.map((_, index) => (
                  <span key={index}></span>
                ))}
              </div>
              <div className="scale">
                <div>40db</div>
                <div>60db</div>
                <div>80db</div>
              </div>
            </div>
          </div>
        </div>
        <div className="quite-img">
          <LazyImage alt="petsnowy" pcImg={quiteImg} mobileImg={mbQuiteImg} />
        </div>
      </div>
    </div>
  );
}
