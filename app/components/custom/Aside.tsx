import React, {useState, Fragment, useEffect} from 'react';
import AddOns from './AddOns';
import Product from './Product';
import Summary from './Summary';
import store, {setStep} from './store';

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

  const handleCheckout = () => {
    console.log(1111);
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
    <aside className="shopping lg:col-start-3 lg:col-end-4 bg-white w-ful h-full flex flex-col">
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
      <div className="content flex-grow lg:px-[40px] lg:py-[20px]">
        {step[selectStep].components.map((item, index) => (
          <Fragment key={index}>{item}</Fragment>
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
          {selectStep === step.length - 1 ? 'Order now' : 'Next step'}
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
