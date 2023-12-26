import { createCookie } from "@shopify/remix-oxygen"; // or cloudflare/deno

export const userPrefs = createCookie("user-prefs", {
  maxAge: 604_800, // one week
});
