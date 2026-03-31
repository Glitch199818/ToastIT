import { NextResponse } from "next/server";
import { polar } from "@/lib/polar";
import { createClient } from "@/lib/supabase/server";

// GET — fetch subscription details
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const customers = await polar.customers.list({ email: user.email });
    if (customers.result.items.length === 0) {
      return NextResponse.json({ subscription: null });
    }

    const customerId = customers.result.items[0].id;
    const subscriptions = await polar.subscriptions.list({
      customerId,
      active: true,
    });

    if (subscriptions.result.items.length === 0) {
      return NextResponse.json({ subscription: null });
    }

    const sub = subscriptions.result.items[0];
    return NextResponse.json({
      subscription: {
        id: sub.id,
        status: sub.status,
        currentPeriodEnd: sub.currentPeriodEnd,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        productId: sub.productId,
      },
    });
  } catch (err) {
    console.error("Subscription fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
  }
}

// POST — cancel subscription (at period end)
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const customers = await polar.customers.list({ email: user.email });
    if (customers.result.items.length === 0) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const customerId = customers.result.items[0].id;
    const subscriptions = await polar.subscriptions.list({
      customerId,
      active: true,
    });

    if (subscriptions.result.items.length === 0) {
      return NextResponse.json({ error: "No active subscription" }, { status: 404 });
    }

    const sub = subscriptions.result.items[0];

    // Cancel at end of billing period (not immediate revoke)
    try {
      await polar.subscriptions.update({
        id: sub.id,
        subscriptionUpdate: {
          cancelAtPeriodEnd: true,
        },
      });
    } catch (updateErr) {
      // If update fails, try the revoke endpoint as fallback
      console.error("subscriptions.update failed, details:", updateErr);
      // Try direct API call as fallback
      const res = await fetch(`https://api.polar.sh/v1/subscriptions/${sub.id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cancel_at_period_end: true }),
      });
      if (!res.ok) {
        const errBody = await res.text();
        console.error("Direct API cancel failed:", res.status, errBody);
        return NextResponse.json({ error: "Failed to cancel" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscription cancel error:", err);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
