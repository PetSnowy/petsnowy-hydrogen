import {Await, Link, useLoaderData} from '@remix-run/react';
import React, {Fragment, useEffect, useState} from 'react';
import {ProductVariantFragmentFragment} from 'storefrontapi.generated';
import {loader} from '~/routes/($locale).custom';
import {LazyImage} from '../Common';
import {Money} from '@shopify/hydrogen';
import store, {setSelectedProduct, setProductImg} from './store';
import {IconCheckout} from '../Icon';
import {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';

type MoneyType = {
  amount: string;
  currencyCode: CurrencyCode;
};
type CollectionProducts = {
  availableForSale: boolean;
  handle: string;
  id: string;
  title: string;
  variants: {
    price: MoneyType;
    image: {
      url: string;
    };
    compareAtPrice: MoneyType;
    sku: string;
    title: string;
  };
};

function ProductForm({
  variants,
  productTitle,
  collectionProducts,
}: {
  productTitle: string;
  variants: Array<ProductVariantFragmentFragment>;
  collectionProducts: CollectionProducts[];
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

  const closeChangeProduct = () => {
    setChangeProduct(false);
  };

  return (
    <div className="product">
      <div className="change flex items-center w-full justify-between">
        <p className="product-title">
          {changeProduct ? 'Select your Product' : productTitle}
        </p>
        <div
          className="change-item cursor-pointer"
          onClick={handleChangeProduct}
        >
          Change
        </div>
      </div>
      {changeProduct && (
        <ChangeProduct
          closeChangeProduct={closeChangeProduct}
          collectionProducts={collectionProducts}
        />
      )}
      {!changeProduct &&
        variants.map((item, index) => (
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

function ChangeProduct({
  collectionProducts,
  closeChangeProduct,
}: {
  collectionProducts: CollectionProducts[];
  closeChangeProduct: () => void;
}) {
  return (
    <div className="change-product">
      {collectionProducts.map((item, index) => (
        <a
          key={index}
          href={`?product=${item.handle}`}
          onClick={closeChangeProduct}
        >
          <div className="change-product-item">
            <LazyImage
              pcImg={item.variants.image.url}
              alt={item.title}
              className="w-[70px] h-[70px]"
            />
            <div className="change-info">
              <p>{item.title}</p>
            </div>
            <div className="price">
              {item.variants.compareAtPrice.amount && (
                <s>
                  <Money data={item.variants.compareAtPrice} />
                </s>
              )}
              <Money data={item.variants.price} />
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export default function Product() {
  const {variants, product, collection} = useLoaderData<typeof loader>();

  const collectionProducts: CollectionProducts[] =
    collection.products.edges.map((item: {node: any}) => {
      const node = item.node;
      const variants = node.variants.edges.map((v: {node: any}) => v.node)[0];
      return {...node, variants};
    });

  return (
    <Await
      resolve={variants}
      errorElement="There was a problem loading product variants"
    >
      {(data) => (
        <ProductForm
          variants={data.product?.variants.nodes || []}
          productTitle={product?.title ? product.title : ''}
          collectionProducts={collectionProducts}
        />
      )}
    </Await>
  );
}
