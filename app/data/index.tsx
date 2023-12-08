import { CountryCode, LanguageCode } from "@shopify/hydrogen/storefront-api-types";

export type Locale = {
  language: LanguageCode;
  country: CountryCode;
  label: string;
  host: string;
  pathPrefix?: string;
};

export const countries: Record<string, Locale> = {
  default: {
    language: 'EN',
    country: 'US',
    label: 'United States (USD $)', // Labels to be shown in the country selector
    host: 'petsnowy-hydrogen-38aaca2461a5e1a11045.o2.myshopify.dev', // The host and pathPrefix are used for linking
  },
  'en-ca': {
    language: 'EN',
    country: 'CA',
    label: 'Canada (CAD $)',
    host: 'ca.petsnowy-hydrogen-38aaca2461a5e1a11045.o2.myshopify.dev',
  },
  'fr-ca': {
    language: 'EN',
    country: 'CA',
    label: 'Canada (Français) (CAD $)',
    host: 'ca.petsnowy-hydrogen-38aaca2461a5e1a11045.o2.myshopify.dev',
    pathPrefix: '/fr',
  },
  'en-au': {
    language: 'EN',
    country: 'AU',
    label: 'Australia (AUD $)',
    host: 'petsnowy-hydrogen-38aaca2461a5e1a11045.o2.myshopify.dev.au',
  },
};
