import pcImg1 from '~/assets/index/product-list-1.png';
import pcImg2 from '~/assets/index/product-list-2.png';
import pcImg3 from '~/assets/index/product-list-3.png';
import pcImg4 from '~/assets/index/product-list-4.png';
import mbImg1 from '~/assets/index/mb-product-list-1.png';
import mbImg2 from '~/assets/index/mb-product-list-2.png';
import mbImg3 from '~/assets/index/mb-product-list-3.png';
import mbImg4 from '~/assets/index/mb-product-list-4.png';
import {Link} from '../Link';
import {LazyImage} from '../Common';

const productListImg = [
  {
    pcImg: pcImg1,
    mbImg: mbImg1,
    url: '/products/snow-water-fountain',
    alt: 'snow-water-fountain',
  },
  {
    pcImg: pcImg2,
    mbImg: mbImg2,
    url: '/products/snow-pet-feeder',
    alt: 'snow-water-fountain',
  },
  {
    pcImg: pcImg3,
    mbImg: mbImg3,
    url: '/products/snow-roly-poly-cat-toy',
    alt: 'snow-roly-poly-cat-toy',
  },
  {
    pcImg: pcImg4,
    mbImg: mbImg4,
    url: '/collections/accessories',
    alt: 'accessories',
  },
];
export default function ProductList() {
  return (
    <div className="product-list bg-[#e9e0cf] lg:pt-[94px] lg:pb-[88px]">
      <div className="container flex justify-between">
        {productListImg.map(({pcImg, mbImg, url, alt}, index) => (
          <Link to={url} key={index} prefetch="intent">
            <LazyImage
              alt={alt}
              pcImg={pcImg}
              mobileImg={mbImg}
              className="lg:w-[264px] lg:h-[346px] aos-init aos-animate transition-all duration-300 ease"
              data-aos="fade-up"
              data-aos-duration={800}
              data-aos-offset={350}
              data-aos-delay={100 * index}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
