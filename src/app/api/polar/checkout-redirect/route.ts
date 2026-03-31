import { NextRequest, NextResponse } from "next/server";
import { polar, PRODUCTS } from "@/lib/polar";
import { createClient } from "@/lib/supabase/server";

function isWithinLaunchWindow() {
  const startIso =
    process.env.TOASTIT_LAUNCH_START_DATE ||
    process.env.NEXT_PUBLIC_TOASTIT_LAUNCH_START_DATE ||
    "2026-03-27T00:00:00.000Z";
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return false;
  const now = new Date();
  const end = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
  return now >= start && now < end;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://toastit.app";

  if (!user) {
    return NextResponse.redirect(`${siteUrl}/auth/signup`);
  }

  const plan = req.nextUrl.searchParams.get("plan");
  if (plan !== "monthly" && plan !== "annual") {
    return NextResponse.redirect(`${siteUrl}/dashboard/pricing`);
  }

  const launchEligible = isWithinLaunchWindow();
  const productId =
    plan === "annual"
      ? launchEligible
        ? PRODUCTS.launchAnnual
        : PRODUCTS.annual
      : launchEligible
        ? PRODUCTS.launchMonthly
        : PRODUCTS.monthly;

  try {
    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: `${siteUrl}/dashboard/create?upgraded=true`,
      customerEmail: user.email,
      metadata: {
        supabase_user_id: user.id,
      },
    });

    return NextResponse.redirect(checkout.url);
  } catch (err) {
    console.error("Checkout redirect error:", err);
    // Fall back to pricing page if checkout fails
    return NextResponse.redirect(`${siteUrl}/dashboard/pricing`);
  }
}
