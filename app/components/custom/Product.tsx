import {Await, useLoaderData} from '@remix-run/react';
import React, {Fragment, useEffect, useState} from 'react';
import {ProductVariantFragmentFragment} from 'storefrontapi.generated';
import {loader} from '~/routes/($locale).custom';
import {LazyImage} from '../Common';
import {Money} from '@shopify/hydrogen';
import store, {setSelectedProduct, setProductImg} from './store';
import {IconCheckout} from '../Icon';

function ProductForm({
  variants,
}: {
  variants: Array<ProductVariantFragmentFragment>;
}) {
  const [clickIndex, setClickIndex] = useState(-1);
  const handleClick = (item: ProductVariantFragmentFragment, index: number) => {
    if (index === clickIndex) return;
    setClickIndex(index);
    store.dispatch(setProductImg(item.image?.url));
    store.dispatch(setSelectedProduct(item));
  };
  // const [id, setId] = useState('');

  // useEffect(() => {
  //   store.subscribe(() => {
  //     const id = store.getState().selectedOptions.selectedProduct?.id;
  //     setId(id ? id : '');
  //   });
  // });

  return (
    <div className="product">
      {variants.map((item, index) => (
        <div className="product-item" key={index}>
          <input
            type="radio"
            name="product"
            id={item.id}
            onChange={() => setClickIndex(index)}
            // checked={id === item.id}
          />
          <label
            htmlFor={item.id}
            className="flex border-[1px] border-[#e9e9e9] border-solid lg:rounded-[10px]"
            onClick={() => handleClick(item, index)}
          >
            <div className="img-wrapper">
              <LazyImage
                alt={item.title}
                pcImg={item.image?.url}
                className="lg:w-[70px] lg:h-[70px]"
              />
            </div>
            <div className="product-content">
              <p>{item.title}</p>
              <p></p>
            </div>
            <div className="product-pice">
              {item.compareAtPrice && (
                <s>
                  <Money data={item.compareAtPrice} />
                </s>
              )}
              <Money data={item.price} />
            </div>
            <div className="check">
              <IconCheckout />
            </div>
          </label>
        </div>
      ))}
    </div>
  );
}

export default function Product() {
  const {variants} = useLoaderData<typeof loader>();
  return (
    <Await
      resolve={variants}
      errorElement="There was a problem loading product variants"
    >
      {(data) => <ProductForm variants={data.product?.variants.nodes || []} />}
    </Await>
  );
}
