import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox",
});

export const PRODUCTS = {
  // Regular monthly (default)
  monthly: process.env.NEXT_PUBLIC_POLAR_MONTHLY_PRODUCT_ID!,
  // Launch-monthly offer for new creators (falls back to regular monthly if not set up yet)
  launchMonthly:
    process.env.NEXT_PUBLIC_POLAR_LAUNCH_MONTHLY_PRODUCT_ID ||
    process.env.NEXT_PUBLIC_POLAR_MONTHLY_PRODUCT_ID!,
  // Regular annual (default)
  annual: process.env.NEXT_PUBLIC_POLAR_ANNUAL_PRODUCT_ID!,
  // Launch annual offer (falls back to regular annual if not set up yet)
  launchAnnual:
    process.env.NEXT_PUBLIC_POLAR_LAUNCH_ANNUAL_PRODUCT_ID ||
    process.env.NEXT_PUBLIC_POLAR_ANNUAL_PRODUCT_ID!,
};
