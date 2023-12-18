import {Await, useLoaderData} from '@remix-run/react';
import React, {Fragment, useEffect, useState} from 'react';
import {ProductVariantFragmentFragment} from 'storefrontapi.generated';
import {loader} from '~/routes/($locale).custom';
import {LazyImage} from '../Common';
import {Money} from '@shopify/hydrogen';
import store, {addOption, setProductImg} from './store';

function ProductForm({
  variants,
}: {
  variants: Array<ProductVariantFragmentFragment>;
}) {
  const [clickIndex, setClickIndex] = useState(0);
  const handleClick = (item: ProductVariantFragmentFragment, index: number) => {
    if (index === clickIndex) return;
    setClickIndex(index);
    store.dispatch(setProductImg(item.image?.url));
    store.dispatch(addOption(item));
  };
  useEffect(() => {
    store.subscribe(() => store.getState().selectedOptions.options);
  });
  return variants.map((item, index) => (
    <Fragment key={index}>
      <input type="radio" name="product" id={item.id} />
      <label
        htmlFor={item.id}
        className="flex"
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
      </label>
    </Fragment>
  ));
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
