import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {LazyImage} from '../Common';
import {ProductVariantFragmentFragment} from 'storefrontapi.generated';
import {AddOnsType} from '~/lib/type';
import {Money} from '@shopify/hydrogen';
import Quantity from './Quantity';
import store, {
  removeOption,
  addOption,
  changeSelectAddOnsQuantity,
} from './store';
import {IconRemove} from '../Icon';

export default function Summary() {
  const [product, setProduct] = useState<ProductVariantFragmentFragment | null>(
    null,
  );
  const [addOnsList, setAddOnsList] = useState<AddOnsType[]>();
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    store.subscribe(() => {
      setProduct(store.getState().selectedOptions.selectedProduct);
      setAddOnsList(store.getState().selectedOptions.addOnsOptions);
      setStep(store.getState().selectedOptions.step);
    });
  }, [product, addOnsList, step]);

  // 设置选中的数量
  const handleQuantityChange = (id: string, quantity: number, _: number) => {
    store.dispatch(changeSelectAddOnsQuantity({id, quantity}));
  };

  const handleRemove = (item: AddOnsType) => {
    store.dispatch(removeOption(item));
  };

  return (
    <div className="summary">
      {!product && !addOnsList?.length ? (
        <p>Please select a product</p>
      ) : (
        <>
          <div className="summary-product">
            {product && (
              <>
                <p className="summary-title">Product</p>
                <div className="flex items-center justify-between">
                  <LazyImage
                    alt={product!.title}
                    pcImg={product?.image?.url}
                    className="lg:w-[70px] lg:h-[70px]"
                  />
                  <div className="product-info">
                    <p>{product?.product.title}</p>
                    <p>{product?.title}</p>
                  </div>
                  <div className="product-price">
                    {product?.compareAtPrice && (
                      <s>
                        <Money data={product.compareAtPrice} />
                      </s>
                    )}
                    <Money data={product?.price!} />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="addOns">
            {addOnsList?.length ? (
              <>
                <p className="addOns-title">Add-ons</p>
                {addOnsList.map((item, index) => {
                  const totalPrice = {
                    amount: String(
                      Number(item!.price.amount) * item!.quantity!,
                    ),
                    currencyCode: item!.price.currencyCode,
                  };
                  const totalCompareAtPrice = {
                    amount: String(
                      Number(item!.compareAtPrice?.amount) * item!.quantity!,
                    ),
                    currencyCode: item!.price.currencyCode,
                  };
                  return (
                    <div className="addOns-item" key={index}>
                      <LazyImage
                        alt={item!.title}
                        pcImg={item?.image?.url}
                        className="lg:w-[70px] lg:h-[70px]"
                      />
                      <div className="product-info">
                        <p>{item?.product.title}</p>
                        <div className="setting flex gap-x-[10px]">
                          <Quantity
                            initialQuantity={item?.quantity!}
                            handleQuantityChange={(quantity) =>
                              handleQuantityChange(item?.id!, quantity, index)
                            }
                          />
                          <div
                            className="remove flex justify-center items-center cursor-pointer"
                            onClick={() => handleRemove(item)}
                          >
                            <IconRemove />
                          </div>
                        </div>
                      </div>
                      <div className="add-price">
                        {item?.compareAtPrice && (
                          <s>
                            <Money data={totalCompareAtPrice} />
                          </s>
                        )}
                        <Money data={totalPrice} />
                      </div>
                    </div>
                  );
                })}
              </>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
