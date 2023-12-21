import {useEffect, useState} from 'react';

export default function Quantity({
  initialQuantity,
  handleQuantityChange,
}: {
  initialQuantity: number;
  handleQuantityChange: (v: number) => void;
}) {
  let [setQuantity, setQuantityState] = useState(initialQuantity);

  useEffect(() => {
    setQuantityState(initialQuantity);
  }, [initialQuantity]);

  const handleIncrease = () => {
    setQuantityState(setQuantity + 1);
    handleQuantityChange(setQuantity + 1);
  };

  const handleDecrease = () => {
    if (setQuantity > 1) {
      setQuantityState(setQuantity - 1);
      handleQuantityChange(setQuantity - 1);
    }
  };

  return (
    <div className="quantity">
      <button
        onClick={handleDecrease}
        className={`subtract ${
          setQuantity === 1 ? 'opacity-[0.5] cursor-no-drop' : ''
        }`}
      >
        -
      </button>
      <span className="quantity-text">{setQuantity}</span>
      <button className="add" onClick={handleIncrease}>
        +
      </button>
    </div>
  );
}
