import {LazyImage} from '../Common';
import honor from '~/assets/index/honor.png';
import honorContent from '~/assets/index/honor-content.png';
import mbHonor from '~/assets/index/mb-honor.png';

const pcImg = [
  {src: require('~/assets/index/honor-1.png'), alt: 'petsnowy'},
  {src: require('~/assets/index/honor-2.png'), alt: 'petsnowy'},
  {src: require('~/assets/index/honor-3.png'), alt: 'petsnowy'},
  {src: require('~/assets/index/honor-4.png'), alt: 'petsnowy'},
];

const mbContentImg = [
  {src: require('~/assets/index/mb-honor-1.png'), alt: 'petsnowy'},
  {src: require('~/assets/index/mb-honor-2.png'), alt: 'petsnowy'},
  {src: require('~/assets/index/mb-honor-3.png'), alt: 'petsnowy'},
];

const mbDescImg = [
  {src: require('~/assets/index/mb-honor-4.png'), alt: 'petsnowy'},
  {src: require('~/assets/index/mb-honor-5.png'), alt: 'petsnowy'},
];
const mbOptionsImg = [
  {src: require('~/assets/index/mb-honor-6.png'), alt: 'petsnowy'},
  {src: require('~/assets/index/mb-honor-7.png'), alt: 'petsnowy'},
  {src: require('~/assets/index/mb-honor-8.png'), alt: 'petsnowy'},
];
export default function Honor() {
  return (
    <div className="new-index-honor bg-[#e9e0cf] lg:pb-[72px]">
      <div className="container">
        <div className="honor-inner">
          <LazyImage alt="petsnowy" pcImg={honor} mobileImg={mbHonor} />
          <div
            className="honor-content aos-init aos-animate"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <LazyImage alt="petsnowy" pcImg={honorContent} />
          </div>
        </div>
        <div className="mb-honor-content">
          {mbContentImg.map(({src, alt}, index) => (
            <LazyImage
              alt={alt}
              mobileImg={src}
              key={index}
              data-aos="fade-up"
              data-aos-duration={800}
              data-aos-offset={300}
              data-aos-delay={300 * index}
            />
          ))}
        </div>
        <div className="mb-honor-desc">
          {mbDescImg.map(({src, alt}, index) => (
            <LazyImage
              mobileImg={src}
              alt={alt}
              key={index}
              data-aos="fade-up"
              data-aos-duration={800}
              data-aos-offset={300}
              data-aos-delay={400 * index}
            />
          ))}
        </div>
        <div className="honor-options">
          {pcImg.map(({src, alt}, index) => (
            <div
              className="options-item aos-init aos-animate"
              data-aos="fade-up"
              data-aos-duration={800}
              data-aos-offset={100}
              data-aos-delay={100 * index}
              key={index}
            >
              <LazyImage alt={alt} pcImg={src} />
            </div>
          ))}
        </div>
        <div className="mb-honor-options">
          {mbOptionsImg.map(({src, alt}, index) => (
            <LazyImage
              alt={alt}
              mobileImg={src}
              key={index}
              data-aos="fade-up"
              data-aos-duration={800}
              data-aos-offset={300}
              data-aos-delay={300 * index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
