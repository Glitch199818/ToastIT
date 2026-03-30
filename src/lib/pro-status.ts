import { cache } from "react";
import { polar } from "@/lib/polar";

/**
 * Check if a user has an active Pro subscription.
 * Wrapped in React cache() so it deduplicates within a single server request.
 */
export const checkProStatus = cache(async (email: string): Promise<boolean> => {
  try {
    const customers = await polar.customers.list({ email });
    if (customers.result.items.length === 0) return false;

    const customerId = customers.result.items[0].id;

    const subscriptions = await polar.subscriptions.list({
      customerId,
      active: true,
    });
    return subscriptions.result.items.length > 0;
  } catch {
    return false;
  }
});
