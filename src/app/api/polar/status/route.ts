import { NextResponse } from "next/server";
import { polar } from "@/lib/polar";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the customer by email
    const customers = await polar.customers.list({
      email: user.email!,
    });

    if (customers.result.items.length === 0) {
      return NextResponse.json({ isPro: false });
    }

    const customerId = customers.result.items[0].id;

    // Check for active subscriptions
    const subscriptions = await polar.subscriptions.list({
      customerId,
      active: true,
    });

    if (subscriptions.result.items.length > 0) {
      return NextResponse.json({ isPro: true, plan: "monthly" });
    }

    // Check for lifetime purchases
    const orders = await polar.orders.list({
      customerId,
      productId: process.env.NEXT_PUBLIC_POLAR_LIFETIME_PRODUCT_ID!,
    });

    if (orders.result.items.length > 0) {
      return NextResponse.json({ isPro: true, plan: "lifetime" });
    }

    return NextResponse.json({ isPro: false });
  } catch {
    return NextResponse.json({ isPro: false });
  }
}
