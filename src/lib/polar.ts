import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
});

export const PRODUCTS = {
  monthly: process.env.NEXT_PUBLIC_POLAR_MONTHLY_PRODUCT_ID!,
  lifetime: process.env.NEXT_PUBLIC_POLAR_LIFETIME_PRODUCT_ID!,
};
