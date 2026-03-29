import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/Sidebar";
import { polar } from "@/lib/polar";
import DashboardToasty from "@/components/dashboard/DashboardToasty";

async function checkProStatus(email: string): Promise<boolean> {
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
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const isPro = await checkProStatus(user.email!);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar isPro={isPro} />
      <main
        style={{
          flex: 1,
          marginLeft: "240px",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
      <DashboardToasty />
    </div>
  );
}
