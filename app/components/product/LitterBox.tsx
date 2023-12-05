import {useEffect, useRef, useState} from 'react';
import {createSlice, configureStore} from '@reduxjs/toolkit';
import classicProductImg from '~/assets/product/classic_product.png';
import classicShowImg from '~/assets/product/classic_show.png';
import creamProductImg from '~/assets/product/white_product.png';
import creamShowImg from '~/assets/product/white_show.png';
import {LazyImage} from '../Common';
import {
  ProductFragment,
  ProductVariantFragment,
  ProductVariantsQuery,
} from 'storefrontapi.generated';
import {Await, Link, useMatches, useLoaderData} from '@remix-run/react';
import {
  AddToCartButton,
  ProductPrice,
} from '~/components/product/ProductCommon';

const selectColor = [
  {name: 'Classic', imageUrl: classicProductImg, showImg: classicShowImg},
  {name: 'Cream', imageUrl: creamProductImg, showImg: creamShowImg},
];

export const controlSlice = createSlice({
  name: 'control',
  initialState: {
    value: 0,
  },
  reducers: {
    setControl: (state, action) => {
      state.value = action.payload;
    },
  },
});

const store = configureStore({
  reducer: controlSlice.reducer,
});

const {setControl} = controlSlice.actions;

export default function LitterBox({
  product,
  variants,
}: {
  product: ProductFragment;
  variants: Promise<ProductVariantsQuery>;
}) {
  const {selectedVariant} = product;

  const [selectedColor, setSelectedColor] = useState<number>(0);

  store.subscribe(() => setSelectedColor(store.getState().value));

  return (
    <div className="LitterBox lg:pt-[44px] lg:pb-[125px]">
      <div className="container flex lg:gap-x-[30px]">
        <div className="show-box">
          <div className="img-wrapper lg:w-[640px] lg:h-[419px] lg:mb-[40px] lg:rounded-[25px] bg-white overflow-hidden">
            <LazyImage
              pcImg={selectColor[selectedColor].showImg}
              alt={selectColor[selectedColor].name}
            />
          </div>
          <div className="swiper-container lg:w-[640px] lg:h-[419px] bg-[#602fc2] overflow-hidden lg:rounded-[25px]"></div>
        </div>
        <div className="select-product">
          <p className="title font-LeagueSpartanBlack lg:text-[39px] text-[#45392E] lg:mb-[5px] uppercase">
            petsnowy
          </p>
          <p className="sub-title font-LeagueSpartanBlack lg:text-[29px] text-[#45392E] lg:mb-[13px]">
            SNOW+ Self-cleaning Litter Box
          </p>
          <p className="font-LeagueSpartan lg:text-[17px] text-[#45392E] lg:mb-[12px]">
            Finally, a litter box that collects all scoop ideas.
          </p>
          <ProductPrice selectedVariant={selectedVariant} />
          <Await
            resolve={variants}
            errorElement="There was a problem loading product variants"
          >
            {(data) => (
              <ProductForm
                product={product}
                selectedVariant={selectedVariant}
                variants={data.product?.variants.nodes || []}
              />
            )}
          </Await>
        </div>
      </div>
    </div>
  );
}
function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  const [lines, setLines] = useState<
    {merchandiseId: string; quantity: number}[]
  >([]);

  const [selectedVariantCount, setSelectedVariantCount] = useState(1);

  const handleLines = (selectedVariant: ProductFragment['selectedVariant']) => {
    window.location.hash = 'cart-aside';
    const selectVariant = [
      {
        merchandiseId: selectedVariant?.id!,
        quantity: selectedVariantCount,
      },
    ];

    const selectMountings: {merchandiseId: string; quantity: number}[] = [];
    const selectElement = document.querySelectorAll(
      '.product .gift-item,.product .add-on-item',
    );
    const selected = selectElement ? Array.from(selectElement) : [];

    for (let i = 0; i < selected.length; i++) {
      const element = selected[i];
      const input = element.querySelector('input');
      if (input?.checked) {
        selectMountings.push({
          merchandiseId: input.value!,
          quantity: 1,
        });
      }
    }
    const updatedLines = [...selectVariant, ...selectMountings];
    setLines((prevLines) => {
      return [...prevLines, ...updatedLines];
    });
  };

  return (
    <>
      <SelectColor />
      <Variants variants={variants} />
      <GetGift />
      <AddOns />
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => handleLines(selectedVariant)}
        lines={lines}
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </>
  );
}

type Link = {
  name: string;
  value: string;
};

function Variants({variants}: {variants: Array<ProductVariantFragment>}) {
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariantFragment[] | null
  >(null);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const generateLink = (handle: string, link: Link[]) => {
    return `/products/${handle}?${link
      .map((option) => `${option.name.replace(/\s/g, '+')}=${option.value}`)
      .join('&')}`;
  };

  useEffect(() => {
    const filteredVariants = variants.filter((item) =>
      item.title.includes(selectColor[selectedColor].name),
    );
    setSelectedVariant(filteredVariants);
  }, [selectedColor]);
  store.subscribe(() => setSelectedColor(store.getState().value));
  return (
    <div className="variants flex lg:gap-[25px]">
      {selectedVariant?.map((item, index) => {
        return (
          <Link
            key={index}
            to={generateLink(item.product.handle, item.selectedOptions)}
            className="block"
            prefetch="intent"
            preventScrollReset
            replace
          >
            <div className="variants-item lg:w-[150px] lg:h-fit lg:p-[10px] flex items-center flex-wrap justify-center">
              <div className="img-wrapper lg:w-[103px] lg:h-[103px]">
                <LazyImage alt={item.title} pcImg={item.image?.url} />
              </div>
              <p>{item.title.split('/').at(-1)}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function SelectColor() {
  const handleSelect = (index: number) => {
    store.dispatch(setControl(index));
  };
  return (
    <div className="select-color flex lg:gap-x-[10px] cursor-pointer mt-[10px] mb-[10px]">
      {selectColor.map((item, index) => {
        return (
          <div key={item.name} className="select-color-item">
            <div
              className="select-color-item-name"
              onClick={() => handleSelect(index)}
            >
              {item.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
type Price = {
  amount: string;
  currencyCode: string;
};
type Edges = {
  node: {
    id: string;
  };
};
type Gift = {
  product: {
    handle: string;
    id: string;
    priceRange: {
      maxVariantPrice: Price;
      minVariantPrice: Price;
    };
    featuredImage: {
      url: string;
    };
    variants: {
      edges: Edges[];
    };
  };
};

function GetGift() {
  const {giftList}: {giftList: Gift[]} = useLoaderData() as any;
  return (
    <div className="gift flex w-full flex-wrap">
      {giftList.map(({product}, index) => (
        <div className="gift-item w-full" key={index} data-category="gift">
          <input
            type="radio"
            id={product.id}
            name="gift"
            value={product.variants.edges[0].node.id}
          />
          <label htmlFor={product.id}>
            <div className="img-wrapper lg:w-[103px] lg:h-[103px] object-contain">
              <LazyImage
                alt={product.handle}
                pcImg={product.featuredImage.url}
              />
            </div>
            <p className="price">
              <s>{product.priceRange.maxVariantPrice.amount}</s>
              <span>{product.priceRange.minVariantPrice.amount}</span>
            </p>
          </label>
        </div>
      ))}
    </div>
  );
}

function AddOns() {
  const {addOnsList}: {addOnsList: Gift[]} = useLoaderData() as any;
  return (
    <div className="addOns flex">
      {addOnsList.map(({product}, index) => (
        <div className="add-on-item w-full" key={index} data-category="addons">
          <input
            type="checkbox"
            name="addons"
            id={product.id}
            value={product.variants.edges[0].node.id}
          />
          <label htmlFor={product.id}>
            <div className="img-wrapper lg:w-[103px] lg:h-[103px] object-contain">
              <LazyImage
                alt={product.handle}
                pcImg={product.featuredImage.url}
              />
            </div>
            <p className="title">{product.handle}</p>
            <p className="price">
              <s>{product.priceRange.maxVariantPrice.amount}</s>
              <span>{product.priceRange.minVariantPrice.amount}</span>
            </p>
          </label>
        </div>
      ))}
    </div>
  );
}
