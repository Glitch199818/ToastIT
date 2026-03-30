"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import InteractiveToasty from "@/components/dashboard/InteractiveToasty";
import { ToastyDrinks, ToastyIdle } from "@/components/dashboard/Toasty";

const IDLE_SUGGESTIONS = [
  "Try the Champagne!",
  "Mojito vibes today?",
  "Espresso Martini is fire",
  "How about a Cosmo?",
  "Pina Colada mood?",
  "Wine o'clock!",
  "Iced Coffee is a classic",
  "Margarita, anyone?",
  "Mimosa for the win!",
];

export default function DashboardToasty() {
  const pathname = usePathname();
  const isRequestDrinks = pathname === "/dashboard/request-drinks";
  const isCreate = pathname === "/dashboard/create" || pathname === "/dashboard";
  const [suggestion, setSuggestion] = useState("");
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionIndex = useRef(0);

  useEffect(() => {
    if (!isCreate) {
      setSuggestion("");
      return;
    }

    const resetIdle = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      setSuggestion("");
      idleTimer.current = setTimeout(() => {
        setSuggestion(IDLE_SUGGESTIONS[suggestionIndex.current % IDLE_SUGGESTIONS.length]);
        suggestionIndex.current += 1;
        // Auto-hide after 5s
        setTimeout(() => setSuggestion(""), 5000);
      }, 8000);
    };

    resetIdle();
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    window.addEventListener("click", resetIdle);
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      window.removeEventListener("click", resetIdle);
    };
  }, [isCreate]);

  return (
    <InteractiveToasty initialBottom={20} initialRight={30} speech={suggestion}>
      {isRequestDrinks ? <ToastyDrinks size={80} /> : <ToastyIdle size={80} />}
    </InteractiveToasty>
  );
}

