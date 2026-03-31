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

  const days = 30;
  const now = new Date();
  const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
  return now >= start && now < end;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();

  // For monthly Pro, charge:
  // - launchMonthly for new signups during the first 30 days of launch
  // - regular monthly for everyone else
  const launchEligible = isWithinLaunchWindow();
  let productId: string;
  if (plan === "annual") {
    productId = launchEligible ? PRODUCTS.launchAnnual : PRODUCTS.annual;
  } else {
    productId = launchEligible ? PRODUCTS.launchMonthly : PRODUCTS.monthly;
  }

  try {
    const token = process.env.POLAR_ACCESS_TOKEN || "";
    console.log("Checkout debug:", {
      productId,
      plan,
      tokenPrefix: token.substring(0, 8) + "...",
      tokenLength: token.length,
    });
    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/create?upgraded=true`,
      customerEmail: user.email,
      metadata: {
        supabase_user_id: user.id,
      },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err: unknown) {
    console.error("Polar checkout error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
