import {useState, Fragment, useEffect} from 'react';
import AddOns from './AddOns';
import Product from './Product';
import Summary from './Summary';
import store, {setStep} from './store';
import {getActiveHeaderHeight} from '~/lib/utils';
import {AddToCartButton} from '~/components';
import {
  CartLineInput,
  CurrencyCode,
} from '@shopify/hydrogen/storefront-api-types';
import {Money} from '@shopify/hydrogen';

type Step = {
  name: string;
  components: JSX.Element[];
};

type ProductMap = {
  merchandiseId: string;
  quantity: number;
};

type MoneyType = {
  amount: string;
  currencyCode: CurrencyCode;
};

const step: Step[] = [
  {name: '1. Product', components: [<Product />]},
  {name: '2. Add-ons', components: [<AddOns />]},
  {name: '3. Summary', components: [<Summary />]},
];

export default function Aside() {
  const [selectStep, setSelectStep] = useState<number>(0);
  const [lines, setLines] = useState<CartLineInput[]>();

  const [money, setMoney] = useState<MoneyType>({
    amount: '0',
    currencyCode: 'USD',
  });

  const [compareMoney, setCompareMoney] = useState<MoneyType>({
    amount: '0',
    currencyCode: 'USD',
  });

  const handleClick = (index: number) => {
    setSelectStep(index);
    store.dispatch(setStep(index));
  };

  useEffect(() => {
    store.subscribe(() => {
      const list = store.getState().selectedOptions.addOnsOptions;
      const selectedProduct = store.getState().selectedOptions.selectedProduct;
      let sum = 0;
      let compareMoney = 0;
      for (let i = 0; i < list!.length; i++) {
        const item = list[i]!;
        const quantity = Number(list[i]!.quantity);
        sum += Number(item.price.amount) * quantity;
        if (item.compareAtPrice) {
          compareMoney += Number(item.compareAtPrice.amount) * quantity;
        } else {
          compareMoney += Number(item.price.amount) * quantity;
        }
      }
      if (selectedProduct) {
        sum += Number(selectedProduct.price.amount);
        if (selectedProduct.compareAtPrice) {
          compareMoney += Number(selectedProduct.compareAtPrice.amount);
        } else {
          compareMoney += Number(selectedProduct.price.amount);
        }
      }
      const currencyCode = selectedProduct?.price.currencyCode ?? 'USD';
      setMoney({amount: String(sum), currencyCode});
      setCompareMoney({amount: String(compareMoney), currencyCode});
    });
  }, []);

  const handleAddCart = () => {
    const list = store.getState().selectedOptions.addOnsOptions;
    const selectedProduct = store.getState().selectedOptions.selectedProduct;

    if (!selectedProduct && !list.length) {
      return;
    }
    const result: ProductMap[] = [];
    selectedProduct &&
      result.push({merchandiseId: selectedProduct!.id, quantity: 1});

    list.length &&
      list.forEach((item) => {
        const productMap: ProductMap = {
          merchandiseId: item!.id,
          quantity: item!.quantity!,
        };
        result.push(productMap);
      });

    setLines([...result]);
  };

  const handlePrevious = () => {
    if (selectStep === 0) return;
    setSelectStep(selectStep - 1);
  };

  useEffect(() => {
    if (selectStep === step.length - 1) return;
    store.dispatch(setStep(selectStep));
  }, [selectStep]);

  return (
    <aside
      className="shopping lg:col-start-3 lg:col-end-4 bg-white w-ful h-full flex flex-col"
      style={{height: `calc(100vh - ${getActiveHeaderHeight()}px)`}}
    >
      <div className="step flex lg:gap-x-[20px] lg:py-[30px] lg:px-[40px] items-center lg:border-b-[1px] border-b-[#e5e5e5]">
        {step.map((item, index) => (
          <div
            className={`step-item transition-all cursor-pointer ${
              index > selectStep ? 'opacity-[0.3]' : ''
            }`}
            key={index}
            onClick={() => handleClick(index)}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="custom-content scrollbar flex-grow lg:px-[40px] lg:py-[20px] lg:overflow-auto">
        {step.map((item, index) => (
          <div
            key={index}
            className={`${selectStep === index ? 'block' : 'hidden'}`}
          >
            {item.components.map((v, i) => (
              <Fragment key={i}>{v}</Fragment>
            ))}
          </div>
        ))}
      </div>
      <div className="footer bottom-0 left-0 w-full bg-[#f4f4f4]">
        <div className="total">
          <p>total</p>
          <div className="price">
            {compareMoney.amount !== money.amount && (
              <s>
                <Money data={compareMoney} />
              </s>
            )}
            <Money data={money} />
          </div>
        </div>
        <div className="btn">
          <div
            className="cursor-pointer next-step relative"
            onClick={() =>
              selectStep === step.length - 1
                ? handleAddCart()
                : handleClick(selectStep + 1)
            }
          >
            {selectStep === step.length - 1 ? (
              <AddToCartButton lines={lines!}>Add to cart</AddToCartButton>
            ) : (
              'Next step'
            )}
          </div>
          <div
            className={`${
              selectStep === 0 ? 'hidden' : ''
            } cursor-pointer last-step`}
            onClick={handlePrevious}
          >
            Previous step
          </div>
        </div>
      </div>
    </aside>
  );
}
