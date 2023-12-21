import {useLoaderData} from '@remix-run/react';
import React, {ChangeEvent, Fragment, useEffect, useState} from 'react';
import {loader} from '~/routes/($locale).custom';
import {LazyImage} from '../Common';
import {Money} from '@shopify/hydrogen';
import {AddOnsType} from '~/lib/type';
import store, {
  changeSelectAddOnsQuantity,
  removeOption,
  addOption,
} from './store';
import {IconCheckout} from '../Icon';
import Quantity from './Quantity';

export default function AddOns() {
  const {addOnsList} = useLoaderData<typeof loader>();
  const [step, setStep] = useState<number>(0);
  const [clearAddOnsList, setClearAddOnsList] = useState<AddOnsType[]>([]);
  const [selectList, setSelectList] = useState<AddOnsType[]>();
  // 处理数据
  useEffect(() => {
    setClearAddOnsList(
      addOnsList.map((data) => {
        const target =
          data.product && data.product.variants && data.product.variants.nodes
            ? data.product.variants.nodes[0]
            : null;
        return target ? {...target, quantity: 1} : null!;
      }),
    );
  }, []);

  // 设置选中的数量
  const handleQuantityChange = (
    id: string,
    quantity: number,
    index: number,
  ) => {
    setClearAddOnsList((items) => {
      const updatedItems = [...items];
      const item = updatedItems[index];
      if (item) {
        const updatedItem = {...item, quantity};
        updatedItems[index] = updatedItem;
      }
      return updatedItems;
    });
    // 改变选中的数量
    store.dispatch(changeSelectAddOnsQuantity({id, quantity}));
  };

  // 当选中的值发生变化
  useEffect(() => {
    store.subscribe(() => {
      setStep(store.getState().selectedOptions.step);
      setSelectList(store.getState().selectedOptions.addOnsOptions);
    });
  }, [step]);

  //选中商品
  const handleChange = (item: AddOnsType, e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    checked
      ? store.dispatch(addOption(item))
      : store.dispatch(removeOption(item));
  };

  return (
    <div className="addons">
      {clearAddOnsList.length &&
        clearAddOnsList.map((item, index) => {
          const selectValue = selectList?.find((v) => v?.id === item?.id);
          return (
            <div className="addons-item" key={index}>
              <input
                type="checkbox"
                name="add-ons"
                id={item?.id}
                onChange={(e) => handleChange(item!, e)}
                checked={selectValue ? true : false}
              />
              <label
                htmlFor={item?.id}
                className="flex border-[1px] border-[#e9e9e9] border-solid lg:rounded-[10px]"
              >
                <div className="img flex items-center justify-center">
                  <LazyImage
                    alt="petsnowy"
                    pcImg={item?.image?.url}
                    className="lg:w-[70px] lg:h-[70px] object-contain"
                  />
                </div>
                <div className="content">
                  <p className="lg:mb-[5px]">{item?.product.title}</p>
                  <Quantity
                    initialQuantity={
                      selectValue ? selectValue?.quantity! : item?.quantity!
                    }
                    handleQuantityChange={(quantity) =>
                      handleQuantityChange(item?.id!, quantity, index)
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
                <div className="check">
                  <IconCheckout />
                </div>
              </label>
            </div>
          );
        })}
    </div>
  );
}
