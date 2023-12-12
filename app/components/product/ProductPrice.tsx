import {Money} from '@shopify/hydrogen';

export default function ProductPrice({selectedVariant}: any) {
  return (
    <div className="product-price">
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
