import React from 'react';

export default function CountDown() {
  return (
    <div className="container flex">
      <div className="discounts">
        <p className="title">Black Friday</p>
        <div className="left-button">Up to $160 OFF</div>
      </div>
      <div className="count-down">
        <div className="time"></div>
        <a
          className="count-down-button"
          href="/products/snow-self-cleaning-litter-box"
        >
          Unlock 30% off
        </a>
      </div>
    </div>
  );
}
