import type { Storefront as HydrogenStorefront } from '@shopify/hydrogen';
import type {
  CountryCode,
  CurrencyCode,
  LanguageCode,
  Maybe,
} from '@shopify/hydrogen/storefront-api-types';

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type Locale = {
  language: LanguageCode;
  country: CountryCode;
  label: string;
  currency: CurrencyCode;
};

export type Localizations = Record<string, Locale>;

export type I18nLocale = Locale & {
  pathPrefix: string;
};

export type Storefront = HydrogenStorefront<I18nLocale>;

export type AddOnsType =
  | ({
    id: string;
    title: string;
    availableForSale: boolean;
    selectedOptions: ({ name: string; value: string } & {})[];
    price: { amount: string; currencyCode: CurrencyCode } & {};
    product: { handle: string; title: string } & {};
  } & {
    sku?: Maybe<string> | undefined;
    image?:
    | ({ url: string } & {
      id?: Maybe<string> | undefined;
      altText?: Maybe<string> | undefined;
      width?: Maybe<number> | undefined;
      height?: Maybe<number> | undefined;
    })
    | null
    | undefined;
    compareAtPrice?:
    | ({ amount: string; currencyCode: CurrencyCode } & {})
    | null
    | undefined;
    unitPrice?:
    | ({ amount: string; currencyCode: CurrencyCode } & {})
    | null
    | undefined;
  } & {
    quantity?: number
  })
  | undefined;
