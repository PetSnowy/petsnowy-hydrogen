import React, {Fragment, useEffect, useMemo, useState} from 'react';
import store from './store';
import {LazyImage} from '../Common';
import {ProductVariantFragmentFragment} from 'storefrontapi.generated';
import {AddOnsType} from '~/lib/type';

export default function Summary() {
  const [product, setProduct] = useState<ProductVariantFragmentFragment | null>(
    null,
  );
  const [addOnsList, setAddOnsList] = useState<AddOnsType[]>();

  useEffect(() => {
    store.subscribe(() => {
      setProduct(store.getState().selectedOptions.selectedProduct);
      setAddOnsList(store.getState().selectedOptions.addOnsOptions);
    });
  }, [product, addOnsList]);

  return (
    <>
      <div className="product flex items-center justify-between">
        {product && (
          <Fragment>
            <LazyImage
              alt={product!.title}
              pcImg={product?.image?.url}
              className="lg:w-[70px] lg:h-[70px]"
            />
            <div className="product-info">
              <p>{product?.product.title}</p>
            </div>
          </Fragment>
        )}
      </div>
      <div className="addOns">
        {addOnsList?.length
          ? addOnsList.map((item, index) => (
              <div key={index}>
                <LazyImage
                  alt={item!.title}
                  pcImg={item?.image?.url}
                  className="lg:w-[70px] lg:h-[70px]"
                />
                <div className="product-info">
                  <p>{item?.product.title}</p>
                  <span>{item?.quantity}</span>
                </div>
              </div>
            ))
          : ''}
      </div>
    </>
  );
}
