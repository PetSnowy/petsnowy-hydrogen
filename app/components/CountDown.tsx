import React, {useEffect, useState} from 'react';

export default function CountDown() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const targetTime = '2023-11-28 00:00:00';
    const timer = setInterval(() => {
      const nowTime = new Date().getTime();
      const inputTime = new Date(targetTime).getTime();
      const times = (inputTime - nowTime) / 1000;
      const d = Math.floor(times / (60 * 60 * 24));
      const h = Math.floor((times % (60 * 60 * 24)) / (60 * 60));
      const m = Math.floor((times % (60 * 60)) / 60);
      const s = Math.floor(times % 60);

      const countdownHTML = `
        <div>
          <p>${d}</p>
          <p>Days</p>
        </div>
        <div>
          <p>${h}</p>
          <p>Hours</p>
        </div>
        <div>
          <p>${m}</p>
          <p>Minutes</p>
        </div>
        <div>
          <p>${s}</p>
          <p>Seconds</p>
        </div>
      `;

      setTime(countdownHTML);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="container flex items-center justify-between">
      <div className="discounts">
        <p className="title">Black Friday</p>
        <div className="left-button flex items-center justify-center">
          Up to $160 OFF
        </div>
      </div>
      <div className="count-down">
        <div className="time" dangerouslySetInnerHTML={{__html: time}}></div>
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
