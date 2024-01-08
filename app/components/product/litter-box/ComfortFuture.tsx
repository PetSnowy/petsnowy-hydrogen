import {IconInstagram} from '~/components/Icon';
import {LazyImage} from '~/components/Common';

type Data = {
  pcImg: string;
  alt: string;
};

export default function ComfortFuture({data}: {data: Data[]}) {
  const first = data.at(0);
  const residue = data.filter((_, index) => index !== 0);

  return (
    <div className="comfort-future bg-[#e9e0cf] lg:py-[60px]">
      <div className="container flex lg:justify-between">
        <div className="left lg:w-[360px]">
          <p className="first-letter:text-[#d75f23] font-LeagueSpartanBlack lg:text-[40px] text-[#504030]">
            Comfort · Future
          </p>
          <a
            data-aos="fade-up"
            data-aos-duration="800"
            href="http://instagram.com/petsnowy_official"
            target="blank"
            className="aos-init aos-animate"
          >
            <span className="icon-instagram">
              <IconInstagram />
            </span>
            <span className="first-letter:text-[#d75f23] text-[#504030] font-LeagueSpartanBlack">
              Follow us on Instagram
            </span>
          </a>
        </div>
        <div className="right flex lg:gap-x-[30px]">
          <div className="first lg:w-[390px] overflow-hidden">
            {first?.pcImg && <LazyImage alt={first.alt} pcImg={first.pcImg} />}
          </div>
          <div className="residue">
            {residue.length
              ? residue.map((item, index) => (
                  <div className="overflow-hidden" key={index}>
                    <LazyImage
                      alt={item.alt}
                      pcImg={item.pcImg}
                      className="lg:w-[180px] object-cover block w-full h-full"
                    />
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
