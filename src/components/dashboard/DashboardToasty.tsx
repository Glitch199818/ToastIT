"use client";

import { usePathname } from "next/navigation";
import InteractiveToasty from "@/components/dashboard/InteractiveToasty";
import { ToastyDrinks, ToastyIdle } from "@/components/dashboard/Toasty";

export default function DashboardToasty() {
  const pathname = usePathname();
  const isRequestDrinks = pathname === "/dashboard/request-drinks";

  return (
    <InteractiveToasty initialBottom={20} initialRight={30}>
      {isRequestDrinks ? <ToastyDrinks size={80} /> : <ToastyIdle size={80} />}
    </InteractiveToasty>
  );
}

