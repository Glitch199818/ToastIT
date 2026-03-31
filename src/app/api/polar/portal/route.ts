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
    // Find customer
    const customers = await polar.customers.list({ email: user.email });
    if (customers.result.items.length === 0) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const customerId = customers.result.items[0].id;

    // Find active subscription
    const subscriptions = await polar.subscriptions.list({
      customerId,
      active: true,
    });

    if (subscriptions.result.items.length === 0) {
      return NextResponse.json({ error: "No active subscription" }, { status: 404 });
    }

    const subId = subscriptions.result.items[0].id;

    // Cancel at period end via direct Polar REST API
    const token = process.env.POLAR_ACCESS_TOKEN || "";
    const apiBase = process.env.POLAR_API_URL || "https://api.polar.sh";
    const res = await fetch(`${apiBase}/v1/subscriptions/${subId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancel_at_period_end: true }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Cancel subscription failed:", {
        status: res.status,
        body: errBody,
        subId,
        apiBase,
        tokenLength: token.length,
      });
      return NextResponse.json(
        { error: `Cancel failed: ${res.status}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscription cancel error:", err);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
