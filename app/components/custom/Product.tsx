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
  productTitle,
}: {
  productTitle: string;
  variants: Array<ProductVariantFragmentFragment>;
}) {
  const [clickIndex, setClickIndex] = useState(-1);
  const handleClick = (item: ProductVariantFragmentFragment, index: number) => {
    if (index === clickIndex) return;
    setClickIndex(index);
    store.dispatch(setProductImg(item.image?.url));
    store.dispatch(setSelectedProduct(item));
  };
  const [step, setStep] = useState<number>(0);
  const [changeProduct, setChangeProduct] = useState<boolean>(false);
  const [selectProduct, setSelectProduct] =
    useState<ProductVariantFragmentFragment | null>(null);

  useEffect(() => {
    store.subscribe(() => {
      setStep(store.getState().selectedOptions.step);
      setSelectProduct(store.getState().selectedOptions.selectedProduct);
    });
    if (step === 2 && !selectProduct) {
      // 当用户没有选中主产品时 到最后一步自动添加 主产品的第一个变体
      store.dispatch(setProductImg(variants[0].image?.url));
      store.dispatch(setSelectedProduct(variants[0]));
    }
  }, [step]);

  const handleChangeProduct = () => {
    setChangeProduct(true);
  };

  return (
    <div className="product">
      <div className="change flex items-center w-full justify-between">
        <p className="product-title">{productTitle}</p>
        <div
          className="change-item cursor-pointer"
          onClick={handleChangeProduct}
        >
          Change
        </div>
      </div>
      {changeProduct && <ChangeProduct />}
      {variants.map((item, index) => (
        <div className="product-item" key={index}>
          <input
            type="radio"
            name="product"
            id={item.id}
            onChange={() => setClickIndex(index)}
            checked={item.id === selectProduct?.id ? true : false}
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

function ChangeProduct() {
  return <div className="change-product">ChangeProduct</div>;
}

export default function Product() {
  const {variants, product} = useLoaderData<typeof loader>();
  return (
    <Await
      resolve={variants}
      errorElement="There was a problem loading product variants"
    >
      {(data) => (
        <ProductForm
          variants={data.product?.variants.nodes || []}
          productTitle={product?.title ? product.title : ''}
        />
      )}
    </Await>
  );
}