import {Money} from '@shopify/hydrogen';

export default function ProductPrice({
  selectedVariant,
  className,
}: {
  selectedVariant: any;
  className?: string;
}) {
  return (
    <div className={`product-price ${className}`}>
      {selectedVariant?.compareAtPrice ? (
        <>
          <div className="product-price-on-sale flex lg:gap-x-[10px]">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} />
      )}
    </div>
  );
}
