import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {LazyImage} from '../Common';
import {ProductVariantFragmentFragment} from 'storefrontapi.generated';
import {AddOnsType} from '~/lib/type';
import {Money} from '@shopify/hydrogen';
import Quantity from './Quantity';
import store, {removeOption, addOption} from './store';

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
      )}
    </div>
  );
}
