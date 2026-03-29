import CardGenerator from "@/components/dashboard/CardGenerator";
import { createClient } from "@/lib/supabase/server";
import { polar } from "@/lib/polar";

async function checkProStatus(email: string): Promise<boolean> {
  try {
    const customers = await polar.customers.list({ email });
    if (customers.result.items.length === 0) return false;
    const customerId = customers.result.items[0].id;

    const subscriptions = await polar.subscriptions.list({ customerId, active: true });
    return subscriptions.result.items.length > 0;
  } catch {
    return false;
  }
}

export default async function CreatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user?.email ? await checkProStatus(user.email) : false;

  return <CardGenerator isPro={isPro} />;
}
