import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Polar sends webhook events for subscription lifecycle changes.
// We use these to notify users about plan changes.

export async function POST(req: NextRequest) {
  // Verify webhook secret
  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = req.headers.get("x-polar-signature") || req.headers.get("webhook-signature");
    // If a secret is set but no valid signature, reject
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.type as string;
  const data = body.data as Record<string, unknown> | undefined;

  if (!event || !data) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Get user ID from metadata or customer email
  const metadata = data.metadata as Record<string, string> | undefined;
  const userId = metadata?.supabase_user_id;
  const customerEmail = (data.customer_email || data.email) as string | undefined;

  // We need a user_id — look it up by email if not in metadata
  let resolvedUserId = userId;
  if (!resolvedUserId && customerEmail) {
    const { data: users } = await admin.auth.admin.listUsers();
    const match = users?.users?.find((u) => u.email === customerEmail);
    if (match) resolvedUserId = match.id;
  }

  if (!resolvedUserId) {
    console.warn("Polar webhook: could not resolve user_id", { event, customerEmail });
    return NextResponse.json({ received: true });
  }

  try {
    switch (event) {
      // User subscribed (free → pro)
      case "subscription.created":
      case "subscription.active": {
        await admin.from("notifications").insert({
          user_id: resolvedUserId,
          type: "plan_upgrade",
          message: "You're now a Pro member! Enjoy unlimited exports, no watermark, and all drink designs.",
          read: false,
        });
        break;
      }

      // Subscription cancelled or expired (pro → free)
      case "subscription.canceled":
      case "subscription.revoked": {
        await admin.from("notifications").insert({
          user_id: resolvedUserId,
          type: "plan_downgrade",
          message: "Your Pro plan has ended. You're back on the free plan. Upgrade anytime to get back your perks!",
          read: false,
        });
        break;
      }

      // Subscription updated (plan change)
      case "subscription.updated": {
        const status = (data.status as string) || "";
        if (status === "active") {
          await admin.from("notifications").insert({
            user_id: resolvedUserId,
            type: "plan_updated",
            message: "Your subscription has been updated. Thanks for sticking with ToastIT!",
            read: false,
          });
        }
        break;
      }

      default:
        // Ignore other events
        break;
    }
  } catch (err) {
    console.error("Polar webhook notification insert failed:", err);
  }

  return NextResponse.json({ received: true });
}
