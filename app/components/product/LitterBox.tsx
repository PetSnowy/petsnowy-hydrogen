import {useEffect, useRef, useState, Fragment} from 'react';
import {createSlice, configureStore} from '@reduxjs/toolkit';
import classicProductImg from '~/assets/product/classic_product.png';
import classicShowImg from '~/assets/product/classic_show.png';
import creamProductImg from '~/assets/product/white_product.png';
import guaranteeImg from '~/assets/product/product_guarantee.png';
import mbGuaranteeImg from '~/assets/product/m_product_guarantee.png';
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

  useEffect(() => {
    store.subscribe(() => setSelectedColor(store.getState().value));
  }, []);

  return (
    <div className="LitterBox lg:pt-[44px] lg:pb-[125px]">
      <div className="container flex lg:gap-x-[30px]">
        <div className="show-box">
          <div className="sticky lg:top-[90px]">
            <div className="img-wrapper lg:w-[640px] lg:h-[419px] lg:mb-[40px] lg:rounded-[25px] bg-white overflow-hidden">
              <LazyImage
                pcImg={selectColor[selectedColor].showImg}
                alt={selectColor[selectedColor].name}
              />
            </div>
            <div className="swiper-container lg:w-[640px] lg:h-[419px] bg-[#602fc2] overflow-hidden lg:rounded-[25px]"></div>
          </div>
        </div>
        <div className="select-product">
          <p className="title font-LeagueSpartanBlack lg:text-[39px] text-[#45392E] lg:mb-[5px] uppercase">
            petsnowy
          </p>
          <p className="sub-title font-LeagueSpartanBlack lg:text-[29px] text-[#45392E] lg:mb-[13px] uppercase">
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
  const productRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const [selectedVariantCount, setSelectedVariantCount] = useState(1);

  const handleLines = (selectedVariant: ProductFragment['selectedVariant']) => {
    const selectMountings: {merchandiseId: string; quantity: number}[] = [];
    const giftElement = productRef.current!.querySelectorAll('.gift-item');
    const addOnElement = productRef.current!.querySelectorAll('.add-on-item');
    const variantsItem = productRef.current!.querySelectorAll('.variants a');
    const error: HTMLElement | null =
      productRef.current!.querySelector('.error');

    const selected = [...giftElement, ...addOnElement];
    setLoading(true);

    if (!examine(variantsItem!)) {
      error!.style.display = 'block';
      const errorParentNode = error?.parentNode as HTMLElement;
      console.log(errorParentNode);
      errorParentNode.scrollIntoView({behavior: 'smooth', block: 'start'});
      setLoading(false);
      return;
    }
    const selectVariant = [
      {
        merchandiseId: selectedVariant?.id!,
        quantity: selectedVariantCount,
      },
    ];

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

    setLines([...selectVariant, ...selectMountings]);

    setLoading(false);
    error!.style.display = 'none';
    window.location.hash = 'cart-aside';
  };

  const examine = (el: NodeListOf<Element>) => {
    let left = 0,
      right = el.length - 1;
    while (left < right) {
      if (el[left].classList.contains('active')) {
        return true;
      }
      if (el[right].classList.contains('active')) {
        return true;
      }
      left++;
      right--;
    }
    if (left === right && el[left].classList.contains('active')) {
      return true;
    }
    return false;
  };

  const handleChange = (newValue: number) => {
    if (newValue <= 1) newValue = 1;
    setSelectedVariantCount(newValue);
  };

  return (
    <div className="product-select" ref={productRef}>
      <SelectColor />
      <Variants variants={variants} />
      <GetGift />
      <AddOns />
      <div className="product-guarantee lg:w-[500px] lg:h-[30px] my-[30px]">
        <LazyImage
          alt="guarantee"
          pcImg={guaranteeImg}
          mobileImg={mbGuaranteeImg}
        />
      </div>
      <div className="flex gap-x-[20px] items-center">
        <div
          className={`add-to-cart flex items-center justify-center ${
            loading ? 'load' : ''
          }`}
        >
          <AddToCartButton
            onClick={() => handleLines(selectedVariant)}
            lines={lines}
            loading={loading}
            disabled={false}
          >
            {/* {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'} */}
            Add to cart
            <div className={`${loading ? 'loading' : ''}`}></div>
          </AddToCartButton>
        </div>
        <Quantity value={selectedVariantCount} handleChange={handleChange} />
      </div>
    </div>
  );
}

type Link = {
  name: string;
  value: string;
};

const variantsDetails = new Map([
  [
    'Classic / Premium',
    {
      title: 'Package List:',
      content: [
        'SNOW⁺ Litter Box (with Odor Control)',
        'Robertet Fragrance Box (2)',
        'Waste Drawer Liners (30 PCS)',
        '1 Year Warranty',
      ],
    },
  ],
  [
    'Classic / Basic',
    {
      title: 'Package List:',
      content: [
        'SNOW⁺ Litter Box (with Odor Control)',
        'Robertet Fragrance Box (2)',
        'Waste Drawer Liners (30 PCS)',
        '1 Year Warranty',
      ],
    },
  ],
  [
    'Classic / Deluxe',
    {
      title: 'Package List:',
      content: [
        'SNOW⁺ Litter Box (with Odor Control)',
        'Robertet Fragrance Box (2)',
        'Waste Drawer Liners (30 PCS)',
        '1 Year Warranty',
      ],
    },
  ],
]);

function Question({
  image,
  target,
  closeQuestion,
}: {
  image: string;
  target: string;
  closeQuestion: (v: boolean) => void;
}) {
  const questionContent = variantsDetails.get(target);
  return (
    <div className="question_mark_popup">
      <div className="popup-wrapper">
        <div className="popup-img">
          <LazyImage alt={target} pcImg={image} />
        </div>
        <div className="popup-content">
          <p className="popup-title">{target}</p>
          <ul>
            <b>{questionContent?.title}</b>
            {questionContent?.content.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div
          className="popup-close cursor-pointer"
          onClick={() => closeQuestion(false)}
        ></div>
      </div>
    </div>
  );
}

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

  const [question, setQuestion] = useState<{
    image: string;
    target: string;
  }>({image: '', target: ''});

  const [showQuestion, setShowQuestion] = useState<boolean>(false);

  const handleQuestion = (image: string | undefined, title: string) => {
    setQuestion({image: image!, target: title});
    setShowQuestion(true);
  };
  const closeQuestion = (value: boolean) => {
    setShowQuestion(value);
  };
  useEffect(() => {
    const filteredVariants = variants.filter((item) =>
      item.title.includes(selectColor[selectedColor].name),
    );
    setSelectedVariant(filteredVariants);
  }, [selectedColor]);

  store.subscribe(() => setSelectedColor(store.getState().value));

  return (
    <div className="variants-wrapper">
      <p className="font-LeagueSpartanBold lg:text-[20px] lg:mb-[20px] text-[#45392e]">
        Product Set
      </p>
      <div className="variants flex lg:gap-[25px]">
        {selectedVariant?.map((item, index) => {
          const link = generateLink(item.product.handle, item.selectedOptions);
          return (
            <Link
              key={index}
              to={link}
              className={`block ${
                window.location.href.includes(link) ? 'active' : ''
              } ${!item.availableForSale ? 'disabled' : ''}`}
              prefetch="intent"
              preventScrollReset
              replace
            >
              <div className="variants-item lg:w-[150px] lg:h-fit lg:p-[10px] flex items-center flex-wrap justify-center bg-white lg:rounded-[12px] relative">
                <div
                  className="question absolute lg:top-[5px] lg:right-[5px] lg:w-[20px] lg:h-[20px] z-[1]"
                  onClick={() => handleQuestion(item.image?.url, item.title)}
                ></div>
                <div className="img-wrapper lg:w-[103px] lg:h-[103px]">
                  <LazyImage alt={item.title} pcImg={item.image?.url} />
                </div>
                <p className="font-LeagueSpartanBold text-[#616161] lg:text-[16px]">
                  {item.title.split('/').at(-1)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <p className="variants-error error hidden">This is a required field.</p>
      {showQuestion && <Question {...question} closeQuestion={closeQuestion} />}
    </div>
  );
}

function SelectColor() {
  const handleSelect = (index: number) => {
    const url = new URL(window.location.href);
    url.search = '';
    history.pushState(null, '', url.toString());
    window.history.replaceState(null, '', url.toString());
    store.dispatch(setControl(index));
  };
  return (
    <>
      <p className="font-LeagueSpartanBold lg:text-[20px] lg:mb-[20px] text-[#45392e]">
        Choose Color
      </p>
      <div className="select-color flex lg:gap-x-[20px] cursor-pointer lg:mt-[10px] lg:mb-[24px]">
        {selectColor.map((item, index) => {
          return (
            <div key={item.name} className="select-color-item">
              <input
                type="radio"
                name="colorItem"
                id={item.name}
                checked={index === store.getState().value}
                onChange={() => handleSelect(index)}
              />
              <label
                htmlFor={item.name}
                className="select-color-label lg:w-[240px] lg:h-[150px] flex items-center justify-center"
              >
                <div className="flex items-center justify-center lg:gap-x-[10px]">
                  <div className="img-wrapper lg:w-[103px] lg:h-[103px] object-contain">
                    <LazyImage alt={item.name} pcImg={item.imageUrl} />
                  </div>
                  <span className="font-LeagueSpartanBold text-[#616161] lg:text-[16px]">
                    {item.name}
                  </span>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </>
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
    <>
      <p className="font-LeagueSpartanBold lg:text-[20px] lg:mb-[20px] text-[#45392e] lg:mt-[26px]">
        Choose Gift
      </p>
      <div className="gift flex w-full flex-wrap lg:gap-y-[24px]">
        {giftList.map(({product}, index) => (
          <div
            className="gift-item lg:w-[500px]"
            key={index}
            data-category="gift"
          >
            <input
              type="radio"
              id={product.id}
              name="gift"
              value={product.variants.edges[0].node.id}
              className=""
            />
            <label
              htmlFor={product.id}
              className="rounded-[13px] overflow-hidden flex"
            >
              <div className="gift-left lg:w-[155px] lg:h-[115px] bg-white flex items-center justify-center">
                <div className="img-wrapper lg:w-[103px] lg:h-[103px] object-contain">
                  <LazyImage
                    alt={product.handle}
                    pcImg={product.featuredImage.url}
                  />
                </div>
              </div>
              <div className="gift-right flex-1"></div>

              {/* <p className="price">
                <s>{product.priceRange.maxVariantPrice.amount}</s>
                <span>{product.priceRange.minVariantPrice.amount}</span>
              </p> */}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}

const addOnsName = [
  'Waste Liner 30 Pcs',
  'Waste Liner 60 Pcs',
  'Waste Liner 120 Pcs',
  'Filter Screen (Mini Mesh)',
  'Fragrance Box 3 Pcs',
];

function AddOns() {
  const {addOnsList}: {addOnsList: Gift[]} = useLoaderData() as any;
  return (
    <>
      <p className="font-LeagueSpartanBold lg:text-[20px] lg:mb-[20px] text-[#45392e] lg:mt-[27px]">
        Add-Ons
      </p>
      <div className="addOns flex flex-wrap lg:gap-[15px]">
        {addOnsList.map(({product}, index) => (
          <div className="add-on-item" key={index} data-category="addons">
            <input
              type="checkbox"
              name="addons"
              id={product.id}
              value={product.variants.edges[0].node.id}
              className=""
            />
            <label
              htmlFor={product.id}
              className="lg:w-[155px] lg:h-[143px] bg-white lg:rounded-[12px] flex items-center justify-center flex-wrap p-[10px] box-border"
            >
              <div className="img-wrapper lg:w-[70px] lg:h-auto lg:mb-[10px] object-contain flex items-center justify-center">
                <LazyImage
                  alt={product.handle}
                  pcImg={product.featuredImage.url}
                />
              </div>
              <p className="title lg:text-[13px] font-LeagueSpartan text-center text-[#616161]">
                {addOnsName[index]}
              </p>
              <p className="price">
                {/* <s>{product.priceRange.maxVariantPrice.amount}</s> */}
                <span className=" font-LeagueSpartanBold lg:text-[16px] text-[#616161]">
                  ${product.priceRange.minVariantPrice.amount}
                </span>
              </p>
            </label>
          </div>
        ))}
      </div>
    </>
  );
}

function Quantity({
  value,
  handleChange,
}: {
  value: number;
  handleChange: (e: number) => void;
}) {
  return (
    <div className="quantity flex items-center justify-between bg-white lg:w-[138px] lg:h-[52px] rounded-[24px]">
      <div
        className="reduce font-LeagueSpartan lg:text-[26px] text-[#5d5d5d] lg:w-[45px] cursor-pointer flex items-center justify-center select-none"
        onClick={() => handleChange(value - 1)}
      >
        -
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(Number(e.target.value))}
        disabled
        className="bg-transparent font-LeagueSpartanBold lg:text-[26px] text-[#5d5d5d] w-[40px] text-center"
      />
      <div
        className="add font-LeagueSpartan lg:text-[26px] text-[#5d5d5d] lg:w-[45px] cursor-pointer flex items-center justify-center select-none"
        onClick={() => handleChange(value + 1)}
      >
        +
      </div>
    </div>
  );
}
