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
import {useShop} from '@shopify/hydrogen-react';

type Step = {
  name: string;
  components: JSX.Element[];
};

type ProductMap = {
  merchandiseId: string;
  quantity: number;
};

const step: Step[] = [
  {name: '1. Product', components: [<Product />]},
  {name: '2. Add-ons', components: [<AddOns />]},
  {name: '3. Summary', components: [<Summary />]},
];

export default function Aside() {
  const [selectStep, setSelectStep] = useState<number>(0);
  const [lines, setLines] = useState<CartLineInput[]>();
  const [money, setMoney] = useState<{
    amount: string;
    currencyCode: CurrencyCode;
  }>({
    amount: '0',
    currencyCode: 'USD',
  });

  const handleClick = (index: number) => {
    setSelectStep(index);
  };

  useEffect(() => {
    store.subscribe(() => {
      const addOnsList = store.getState().selectedOptions.addOnsOptions;
      const selectedProduct = store.getState().selectedOptions.selectedProduct;
      let sum = 0;
      for (let i = 0; i < addOnsList!.length; i++) {
        const item = addOnsList[i]!;
        sum += Number(item.price.amount) * Number(addOnsList[i]!.quantity);
      }
      if (selectedProduct) sum += Number(selectedProduct.price.amount);
      const currencyCode = selectedProduct?.price.currencyCode ?? 'USD';
      setMoney({amount: String(sum), currencyCode});
    });
  }, []);

  const handleAddCart = () => {
    const list = store.getState().selectedOptions.addOnsOptions;
    const selectedProduct = store.getState().selectedOptions.selectedProduct;

    const result: ProductMap[] = [];
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
            className="step-item cursor-pointer"
            key={index}
            onClick={() => handleClick(index)}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="custom-content content flex-grow lg:px-[40px] lg:py-[20px] lg:overflow-auto">
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
        {/* {step[selectStep].components.map((item, index) => (
          <Fragment key={index}>{item}</Fragment>
        ))} */}
      </div>
      <div className="footer bottom-0 left-0 w-full lg:h-[200px] bg-[#f4f4f4]">
        <div className="">
          <p>total</p>
          <Money data={money} />
        </div>
        <div
          className="bg-red-50 cursor-pointer"
          onClick={() =>
            selectStep === step.length - 1
              ? handleAddCart()
              : setSelectStep(selectStep + 1)
          }
        >
          {selectStep === step.length - 1 ? (
            <AddToCartButton lines={lines!} disabled={false}>
              Add to cart
            </AddToCartButton>
          ) : (
            'Next step'
          )}
        </div>
        <div
          className={`${selectStep === 0 ? 'hidden' : ''}`}
          onClick={handlePrevious}
        >
          Previous step
        </div>
      </div>
    </aside>
  );
}
