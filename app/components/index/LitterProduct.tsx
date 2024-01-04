import {Fragment, useEffect, useRef} from 'react';
import cartImg from '~/assets/index/cat-pc.png';
import cartImgMb from '~/assets/index/cat-mb.png';
import {LazyImage} from '~/components/Common';
import {Link} from '../Link';

export default function LitterProduct({top}: {top: number}) {
  const options = [
    {
      value: ['Hands', '-free'],
    },
    {
      value: ['Zero', 'Odor'],
    },
    {
      value: ['Less', 'Mess'],
    },
  ];
  const targetRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;

      requestAnimationFrame(() => {
        if (scrollTop >= top && targetRef.current) {
          targetRef.current.style.transform = 'scale(1)';
        } else if (scrollTop < top && targetRef.current) {
          targetRef.current.style.transform = 'scale(0.9)';
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [top]);

  return (
    <div className="new-index-litter">
      <div className="container">
        <p
          className="title aos-init aos-animate"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <span>Finally, a Litter Box </span>
          <span>That Collects All</span> <span>Scoop Ideas</span>
        </p>
        <div className="play" ref={targetRef}>
          <LazyImage mobileImg={cartImgMb} pcImg={cartImg} alt="petsnowy" />
        </div>
        <div className="litter-content">
          <p
            className="sub-title aos-init aos-animate"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            SNOW+ Self-cleaning Litter Box
          </p>
          <p
            className="title aos-init aos-animate"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <span>Finally, a Litter Box </span>
            <span>That Collects All</span> <span>Scoop Ideas</span>
          </p>
          <div className="options">
            {options.map((item, index) => {
              return (
                <Fragment key={index}>
                  <div className="item">
                    {item.value.map((p, subIndex) => (
                      <p key={subIndex}>{p}</p>
                    ))}
                  </div>
                  {index != 2 && <i className="line"></i>}
                </Fragment>
              );
            })}
          </div>
          <Link
            to={'/products/snow-self-cleaning-litter-box'}
            className="button"
            prefetch="intent"
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
