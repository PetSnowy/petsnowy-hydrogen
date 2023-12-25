import {Video} from '~/components/Common';
import LitterProduct from '~/components/index/LitterProduct';
import Text from '~/components/index/Text';
import pcIndexVideoPoster from '~/assets/index/index-video-poster.png';
import mbIndexVideoPoster from '~/assets/index/mb-index-video-poster.png';
import '~/styles/index/index.css';

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
