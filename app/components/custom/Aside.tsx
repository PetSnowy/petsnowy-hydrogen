import {useState, Fragment, useEffect, useMemo} from 'react';
import AddOns from './AddOns';
import Product from './Product';
import Summary from './Summary';
import store, {setStep} from './store';
import {getActiveHeaderHeight} from '~/lib/utils';
import {
  CartProvider,
  useCart,
  CartCheckoutButton,
} from '@shopify/hydrogen-react';

type Step = {
  name: string;
  components: JSX.Element[];
};

const step: Step[] = [
  {name: '1. Product', components: [<Product />]},
  {name: '2. Add-ons', components: [<AddOns />]},
  {name: '3. Summary', components: [<Summary />]},
];

export default function Aside() {
  const [selectStep, setSelectStep] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const handleClick = (index: number) => {
    setSelectStep(index);
  };

  useEffect(() => {
    store.subscribe(() => {
      let sum = 0;
      const addOnsList = store.getState().selectedOptions.addOnsOptions;
      const selectedProduct = store.getState().selectedOptions.selectedProduct;
      for (let i = 0; i < addOnsList!.length; i++) {
        const item = addOnsList[i]!;
        sum += Number(item.price.amount) * Number(addOnsList[i]!.quantity);
      }
      if (selectedProduct) sum += Number(selectedProduct.price.amount);
      setTotal(sum);
    });
  }, []);

  const handleCheckout = () => {
    console.log(store.getState().selectedOptions.addOnsOptions);
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
      <div className="step flex lg:gap-x-[20px] lg:py-[20px] lg:px-[40px] items-center lg:border-b-[1px] border-b-[#e5e5e5]">
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
      <div className="content flex-grow lg:px-[40px] lg:py-[20px] lg:overflow-auto">
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
      <div className="footer bottom-0 left-0 w-full lg:h-[200px] bg-[#f4f4f4]">
        <p>total {`${total}`}</p>
        <div
          className="lg:w-[100px] lg:h-[30px] bg-red-50 text-[red] cursor-pointer"
          onClick={() =>
            selectStep === step.length - 1
              ? handleCheckout()
              : setSelectStep(selectStep + 1)
          }
        >
          {selectStep === step.length - 1 ? 'checkout' : 'Next step'}
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

function CartComponent() {
  const {linesAdd, status} = useCart();

  const merchandise = {
    merchandiseId: '44550969590082',
  };

  return (
    <div>
      Cart Status: {status}
      <button onClick={() => linesAdd([merchandise])}>Add Line</button>
    </div>
  );
}
