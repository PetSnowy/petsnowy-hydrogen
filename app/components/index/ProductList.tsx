import {Link} from '../Link';
import {LazyImage} from '../Common';

const productListImg = [
  {
    pcImg: require('~/assets/index/product-list-1.png'),
    mbImg: require('~/assets/index/mb-product-list-1.png'),
    url: '/products/snow-water-fountain',
    alt: 'snow-water-fountain',
  },
  {
    pcImg: require('~/assets/index/product-list-2.png'),
    mbImg: require('~/assets/index/mb-product-list-2.png'),
    url: '/products/snow-pet-feeder',
    alt: 'snow-water-fountain',
  },
  {
    pcImg: require('~/assets/index/product-list-3.png'),
    mbImg: require('~/assets/index/mb-product-list-3.png'),
    url: '/products/snow-roly-poly-cat-toy',
    alt: 'snow-roly-poly-cat-toy',
  },
  {
    pcImg: require('~/assets/index/product-list-4.png'),
    mbImg: require('~/assets/index/mb-product-list-4.png'),
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
              data-aos-offset={100}
              data-aos-delay={100 * index}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
