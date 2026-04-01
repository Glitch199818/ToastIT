"use client";

import { useEffect, useState, type ReactNode } from "react";

const MOBILE_BREAKPOINT = 768;

export default function DashboardMain({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <main
      style={{
        flex: 1,
        marginLeft: isMobile ? 0 : "240px",
        paddingTop: isMobile ? "56px" : 0,
        backgroundColor: "#ffffff",
        minHeight: "100vh",
      }}
    >
      {children}
    </main>
  );
}
