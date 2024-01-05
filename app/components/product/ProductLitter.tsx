import productLitter from '~/assets/product/product-litter.png';
import mbProductLitter from '~/assets/product/mb-product-litter.png';
import productLitter2 from '~/assets/product/product-litter-2.png';
import mbProductLitter2 from '~/assets/product/mb-product-litter-2.png';
import productLitter3 from '~/assets/product/product-litter-3.png';
import mbProductLitter3 from '~/assets/product/mb-product-litter-3.png';
import productLitter4 from '~/assets/product/product-litter-4.png';
import mbProductLitter4 from '~/assets/product/mb-product-litter-4.png';
import productLitter5 from '~/assets/product/product-litter-5.png';
import mbProductLitter5 from '~/assets/product/mb-product-litter-5.png';
import productLitter6 from '~/assets/product/product-litter-6.png';
import mbProductLitter6 from '~/assets/product/mb-product-litter-6.png';

import {LazyImage} from '../Common';

export default function ProductLitter() {
  return (
    <div className="product-litter bg-[#e9e0cf]">
      <div className="container">
        <div className="litter-img">
          <LazyImage
            pcImg={productLitter}
            mobileImg={mbProductLitter}
            alt="litter"
          />
        </div>
        <div className="litter-2">
          <div className="litter-container">
            <div className="litter-content">
              <p
                className="litter-title aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                A Fresh Start to
                <br />
                Your Morning Routine
              </p>
              <p
                className="litter-desc aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                Everyday, PetSnowy filters out unwanted litters and maintains a
                clean, hygienic place for your cats. Want to change the whole
                litter bed? With just one click or a tap on your phone, PetSnowy
                will dump and pack it up for you.
              </p>
            </div>
            <LazyImage
              pcImg={productLitter2}
              mobileImg={mbProductLitter2}
              alt="litter"
            />
          </div>
        </div>

        <div className="litter-3">
          <div className="litter-container">
            <LazyImage
              pcImg={productLitter3}
              mobileImg={mbProductLitter3}
              alt="litter"
            />
            <div className="litter-content">
              <p
                className="litter-title aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                You have cats AND your house smells good!
              </p>
              <p
                className="litter-desc aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                <span className="special">3-Stage Deodorization</span> TiO2
                System <span className="thick">decomposes</span> bacteria and
                fungi. Robertet Fragrance{' '}
                <span className="thick">neutralizes</span> smelly factors.
                Enclosed structure
                <span className="thick">contains</span> odors
              </p>
            </div>
          </div>
        </div>

        <div className="litter-4">
          <div className="litter-container">
            <div className="litter-content">
              <p
                className="litter-title aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                Pull to pack
                <br />
                trap in odors and dust
              </p>
              <p
                className="litter-desc aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                Patented self-packing design automatically pack the waste for
                you so you can keep your hands and your nose clean. Avoid direct
                exposure to the harm and the foul! lt&apos; s self-pack yet not
                sealed so you can still check on your cats’ health if you want.
              </p>
            </div>
            <LazyImage
              pcImg={productLitter4}
              mobileImg={mbProductLitter4}
              alt="litter"
            />
          </div>
        </div>

        <div className="litter-5">
          <div className="litter-container">
            <LazyImage
              pcImg={productLitter5}
              mobileImg={mbProductLitter5}
              alt="litter"
            />
            <div className="litter-content">
              <p
                className="litter-title aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                Max the good,
                <br />
                nix the bad.
                <br />
                More details <br />
                Less work
              </p>
              <p
                className="litter-desc aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                *Anti-tracking curved walkway design, keeps the litter in and
                your floor clean. Trap litter at its source with the included
                walkway mat that&apos;s gentle on your cats’ feet.
              </p>
            </div>
          </div>
        </div>

        <div className="litter-6">
          <div className="litter-container">
            <LazyImage
              pcImg={productLitter6}
              mobileImg={mbProductLitter6}
              alt="litter"
            />
            <div className="litter-content">
              <p
                className="litter-desc aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                *Magnetic assembly design maximizes convenience by eliminating
                the hassle of assembling and disassembling, with no worries over
                components falling off, while minimizing wear and tear.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
