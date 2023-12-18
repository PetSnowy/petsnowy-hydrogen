import {useLoaderData} from '@remix-run/react';
import React, {Fragment} from 'react';
import {loader} from '~/routes/($locale).custom';
import {LazyImage} from '../Common';
import {Money} from '@shopify/hydrogen';

export default function AddOns() {
  const {addOnsList} = useLoaderData<typeof loader>();

  return (
    <div>
      {addOnsList!.map(({product}, index) => {
        const item = product?.variants.nodes[0];
        return (
          <div key={index}>
            <input type="checkbox" name="add-ons" id={item?.id} />
            <label htmlFor={item?.id}>
              <div className="img">
                <LazyImage
                  alt="petsnowy"
                  pcImg={item?.image?.url}
                  className="lg:w-[70px] lg:h-[70px] object-contain"
                />
              </div>
              <div className="content">
                <p>{item?.product.title}</p>
              </div>
              <div className="add-price">
                {item?.compareAtPrice && (
                  <s>
                    <Money data={item.compareAtPrice} />
                  </s>
                )}
                <Money data={item?.price!} />
              </div>
            </label>
          </div>
        );
      })}
    </div>
  );
}
