import { NextRequest, NextResponse } from "next/server";
import { polar, PRODUCTS } from "@/lib/polar";
import { createClient } from "@/lib/supabase/server";

function isWithinLaunchWindow(userCreatedAt: string | null | undefined) {
  if (!userCreatedAt) return false;
  const startIso =
    process.env.TOASTIT_LAUNCH_START_DATE ||
    process.env.NEXT_PUBLIC_TOASTIT_LAUNCH_START_DATE ||
    "2026-03-27T00:00:00.000Z";
  const start = new Date(startIso);
  const createdAt = new Date(userCreatedAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(createdAt.getTime())) return false;

  const days = 30;
  const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
  return createdAt >= start && createdAt < end;
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
  let productId: string;
  if (plan === "annual") {
    const launchEligible = isWithinLaunchWindow(user.created_at);
    productId = launchEligible ? PRODUCTS.launchAnnual : PRODUCTS.annual;
  } else {
    const launchEligible = isWithinLaunchWindow(user.created_at);
    productId = launchEligible ? PRODUCTS.launchMonthly : PRODUCTS.monthly;
  }

  const checkout = await polar.checkouts.create({
    products: [productId],
    successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/create?upgraded=true`,
    customerEmail: user.email,
    metadata: {
      supabase_user_id: user.id,
    },
  });

  return NextResponse.json({ url: checkout.url });
}
