import {Video} from '~/components/Common';
import LitterProduct from '~/components/index/LitterProduct';
import ProductList from '~/components/index/ProductList';
import pcIndexVideoPoster from '~/assets/index/index-video-poster.png';
import mbIndexVideoPoster from '~/assets/index/mb-index-video-poster.png';
import '~/styles/index/index.css';
import {LoaderFunctionArgs, redirect} from '@shopify/remix-oxygen';
import {countries} from '../data/countries';
import {CountryCode} from '@shopify/hydrogen/storefront-api-types';
import {getClientIPAddress} from 'remix-utils/get-client-ip-address';
import SwiperVideo, {
  type Data as SwiperVideoData,
} from '~/components/index/SwiperVideo';
import SwiperVideoIMg1 from '~/assets/index/index-video-swiper-1.png';
import SwiperVideoIMg2 from '~/assets/index/index-video-swiper-2.png';
import SwiperVideoIMg3 from '~/assets/index/index-video-swiper-3.png';
import SwiperVideoIMg4 from '~/assets/index/index-video-swiper-4.png';
import SwiperVideoIMg5 from '~/assets/index/index-video-swiper-5.png';
import SwiperVideoIMg6 from '~/assets/index/index-video-swiper-6.png';
import SwiperVideoIMg7 from '~/assets/index/index-video-swiper-7.png';

type IP = {
  country_code: CountryCode;
  country_name: string;
  IPv4: string;
  latitude: number;
  longitude: number;
  state: string;
  city: string;
  postal: any;
};

export async function loader({request}: LoaderFunctionArgs) {
  const ipAddress = getClientIPAddress(request);
  if (ipAddress) {
    const redirectUrl = await detectionUserIP(request, ipAddress);
    return redirectUrl ? redirect(redirectUrl, 302) : null;
  }
  return null;
}

// 检测用户 IP 进行重定向
async function detectionUserIP(request: Request, IP: string) {
  const url = `https://api.ip.sb/geoip/${IP}`;
  const {origin, pathname} = new URL(request.url);
  const entries = Object.entries(countries);

  const [locationKey] = findCode(
    entries,
    pathname.split('/')[1].toLocaleUpperCase().split('-').at(1)!,
  );

  if (locationKey) return;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const ipData = data as IP;

    if (ipData.country_code === 'US') return;
    const [locationKey] = findCode(entries, ipData.country_code);

    if (!locationKey) return;

    const redirectUrl = `${origin}${locationKey}`;
    return redirectUrl.trim() === request.url ? null : redirectUrl + '/';
  } catch (error) {
    console.log(error);
    return;
  }
}

function findCode(entries: any[], code: string) {
  return entries.find(([_, value]) => value.country === code) || ['', null];
}

const swiperVideoData: SwiperVideoData[] = [
  {
    pcImg: SwiperVideoIMg1,
    mbImg: '',
    alt: 'litter box',
    url: 'https://cdn.shopify.com/videos/c/o/v/356ba8a50bb547e3ab6e80529cf2f47e.mp4',
  },
  {
    pcImg: SwiperVideoIMg2,
    mbImg: '',
    alt: 'litter box',
    url: 'https://cdn.shopify.com/videos/c/o/v/ec9a08a5764c47beb88447699b56b704.mp4',
  },
  {
    pcImg: SwiperVideoIMg3,
    mbImg: '',
    alt: 'litter box',
    url: 'https://cdn.shopify.com/videos/c/o/v/5f38abcedf0f4825bba962ad8b07013c.mp4',
  },
  {
    pcImg: SwiperVideoIMg4,
    mbImg: '',
    alt: 'litter box',
    url: 'https://cdn.shopify.com/videos/c/o/v/93daf5c9770e4fe797f8f10d160f706e.mp4',
  },
  {
    pcImg: SwiperVideoIMg5,
    mbImg: '',
    alt: 'litter box',
    url: 'https://cdn.shopify.com/videos/c/o/v/dfe0987fa314402ba83e72c5b4309c98.mp4',
  },
  {
    pcImg: SwiperVideoIMg6,
    mbImg: '',
    alt: 'litter box',
    url: 'https://cdn.shopify.com/videos/c/o/v/cab9e68aabdd40368daf52cc25449744.mp4',
  },
  {
    pcImg: SwiperVideoIMg7,
    mbImg: '',
    alt: 'litter box',
    url: 'https://cdn.shopify.com/videos/c/o/v/82eefb89f78340e882fb267307d59cbc.mov',
  },
];

export default function Homepage() {
  return (
    <>
      <Video
        pcDataSrc="https://cdn.shopify.com/videos/c/o/v/85c7ad8fc6e74e3fa6f8961f103ba778.mp4"
        pcPoster={pcIndexVideoPoster}
        mbDataSrc="https://cdn.shopify.com/videos/c/o/v/1746fd8ffc9248a78d697693f1f94958.mp4"
        mbPoster={mbIndexVideoPoster}
        height="100vh"
      />
      <LitterProduct top={300} />
      <ProductList />
      <SwiperVideo data={swiperVideoData} />
    </>
  );
}
