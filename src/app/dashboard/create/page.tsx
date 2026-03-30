import CardGenerator from "@/components/dashboard/CardGenerator";
import { createClient } from "@/lib/supabase/server";
import { checkProStatus } from "@/lib/pro-status";

export default async function CreatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user?.email ? await checkProStatus(user.email) : false;

  return <CardGenerator isPro={isPro} />;
}
