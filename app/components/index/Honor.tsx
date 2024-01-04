import {LazyImage} from '../Common';
import honor from '~/assets/index/honor.png';
import honorContent from '~/assets/index/honor-content.png';
import honor1 from '~/assets/index/honor-1.png';
import honor2 from '~/assets/index/honor-2.png';
import honor3 from '~/assets/index/honor-3.png';
import honor4 from '~/assets/index/honor-4.png';
import mbHonor from '~/assets/index/mb-honor.png';

export default function Honor() {
  const pcImg = [
    {src: honor1, alt: 'petsnowy'},
    {src: honor2, alt: 'petsnowy'},
    {src: honor3, alt: 'petsnowy'},
    {src: honor4, alt: 'petsnowy'},
  ];
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
        <div className="mb-honor-content"></div>
        <div className="mb-honor-desc"></div>
        <div className="honor-options">
          {pcImg.map(({src, alt}, index) => (
            <div
              className="options-item aos-init aos-animate"
              data-aos="fade-up"
              data-aos-duration={800}
              data-aos-offset={350}
              data-aos-delay={100 * index}
              key={index}
            >
              <LazyImage alt={alt} pcImg={src} />
            </div>
          ))}
        </div>
        <div className="mb-honor-options"></div>
      </div>
    </div>
  );
}
