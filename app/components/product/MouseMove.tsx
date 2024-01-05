import {ReactNode, useEffect, useRef} from 'react';

type ProductInventoryState = {
  yRange: number[];
  xRange: number[];
  children: ReactNode;
};

export default function MouseMove({
  xRange,
  yRange,
  children,
  ...props
}: ProductInventoryState) {
  const containerRef = useRef<HTMLDivElement>(null);

  const getRotate = (range: number[], value: number, max: number) =>
    (value / max) * (range[1] - range[0]) + range[0];

  const handleMousemove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const {width, height} = rect;
    const ry = -getRotate(yRange, offsetX, width);
    const rx = getRotate(xRange, offsetY, height);
    containerRef.current.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    containerRef.current.style.transition = 'none';
  };

  const handleMouseout = () => {
    if (!containerRef.current) return;
    containerRef.current.style.transition = 'transform 0.3s ease';
    containerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  const removeListener = () => {
    containerRef.current?.removeEventListener('mousemove', (e) =>
      handleMousemove(e as unknown as React.MouseEvent<HTMLDivElement>),
    );
    containerRef.current?.removeEventListener('mouseout', handleMouseout);
  };

  useEffect(() => {
    containerRef.current?.addEventListener('mousemove', (e) =>
      handleMousemove(e as unknown as React.MouseEvent<HTMLDivElement>),
    );

    containerRef.current?.addEventListener('mouseout', handleMouseout);

    return () => removeListener();
  }, []);

  return (
    <div ref={containerRef} className="mouse-move" {...props}>
      {children}
    </div>
  );
}
