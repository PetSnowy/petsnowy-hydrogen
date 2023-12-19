import {useLoaderData} from '@remix-run/react';
import React, {ChangeEvent, Fragment, useEffect, useState} from 'react';
import {loader} from '~/routes/($locale).custom';
import {LazyImage} from '../Common';
import {Money} from '@shopify/hydrogen';
import {AddOnsType} from '~/lib/type';
import store, {removeOption, addOption, setOptionQuantity} from './store';

export default function AddOns() {
  const {addOnsList} = useLoaderData<typeof loader>();

  const [quantity] = useState<number>(1);

  const handleQuantityChange = (id: string, v: number) => {
    store.dispatch(setOptionQuantity({id, quantity: v}));
  };
  const handleChange = (item: AddOnsType, e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    checked
      ? store.dispatch(addOption({...item, quantity}))
      : store.dispatch(removeOption(item));
  };

  return (
    <div>
      {addOnsList!.map(({product}, index) => {
        const item = product?.variants.nodes[0];
        return (
          <div key={index}>
            <input
              type="checkbox"
              name="add-ons"
              id={item?.id}
              onChange={(e) => handleChange(item, e)}
            />
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
                <Quantity
                  handleQuantityChange={(_, v) =>
                    handleQuantityChange(item!.id, v)
                  }
                />
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

function Quantity({
  handleQuantityChange,
  quantity,
}: {
  handleQuantityChange: (_id: string, v: number) => void;
  quantity?: number;
}) {
  let [setQuantity, setQuantityState] = useState(quantity ?? 1);
  useEffect(() => {
    handleQuantityChange('', setQuantity);
  }, [setQuantity]);
  return (
    <div className="quantity">
      <button
        onClick={() => setQuantityState(setQuantity === 1 ? 1 : --setQuantity)}
      >
        -
      </button>
      <span>{setQuantity}</span>
      <button onClick={() => setQuantityState(++setQuantity)}>+</button>
    </div>
  );
}
