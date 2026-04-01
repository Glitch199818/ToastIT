import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/Sidebar";
import { checkProStatus } from "@/lib/pro-status";
import DashboardToasty from "@/components/dashboard/DashboardToasty";
import DashboardMain from "@/components/dashboard/DashboardMain";

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
      <DashboardMain>{children}</DashboardMain>
      <DashboardToasty />
    </div>
  );
}
