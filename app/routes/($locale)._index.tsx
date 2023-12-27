import {Video} from '~/components/Common';
import LitterProduct from '~/components/index/LitterProduct';
import Text from '~/components/index/Text';
import pcIndexVideoPoster from '~/assets/index/index-video-poster.png';
import mbIndexVideoPoster from '~/assets/index/mb-index-video-poster.png';
import '~/styles/index/index.css';
import {LoaderFunctionArgs, redirect} from '@shopify/remix-oxygen';
import {countries} from '../data/countries';
import {CountryCode} from '@shopify/hydrogen/storefront-api-types';
import {getClientIPAddress} from 'remix-utils/get-client-ip-address';

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
  // const KEY = 'b69c3f76ef9cdf7c0106d97ee66fe3c7';
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
      <Text />
    </>
  );
}
