import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
});

export const PRODUCTS = {
  // Regular monthly (falls back to launch if regular not set)
  monthly:
    process.env.NEXT_PUBLIC_POLAR_MONTHLY_PRODUCT_ID ||
    process.env.NEXT_PUBLIC_POLAR_LAUNCH_MONTHLY_PRODUCT_ID!,
  // Launch-monthly offer (falls back to regular if launch not set)
  launchMonthly:
    process.env.NEXT_PUBLIC_POLAR_LAUNCH_MONTHLY_PRODUCT_ID ||
    process.env.NEXT_PUBLIC_POLAR_MONTHLY_PRODUCT_ID!,
  // Regular annual (falls back to launch if regular not set)
  annual:
    process.env.NEXT_PUBLIC_POLAR_ANNUAL_PRODUCT_ID ||
    process.env.NEXT_PUBLIC_POLAR_LAUNCH_ANNUAL_PRODUCT_ID!,
  // Launch annual offer (falls back to regular if launch not set)
  launchAnnual:
    process.env.NEXT_PUBLIC_POLAR_LAUNCH_ANNUAL_PRODUCT_ID ||
    process.env.NEXT_PUBLIC_POLAR_ANNUAL_PRODUCT_ID!,
};
