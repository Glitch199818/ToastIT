"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth state
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setIsLoggedIn(true);
    });
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;

        doc.querySelectorAll("a, button").forEach((el) => {
          const text = el.textContent?.toLowerCase().trim() || "";

          // "Go Pro" buttons should carry the plan context
          if (text === "go pro") {
            // Detect which plan card this belongs to by checking nearby price text
            const card = el.closest(".prc");
            const priceText = card?.querySelector(".pra")?.textContent || "";
            const isAnnual =
              priceText.includes("one-time") || priceText.includes("/year") || priceText.includes("48");
            const plan = isAnnual ? "annual" : "monthly";

            el.addEventListener("click", (e) => {
              e.preventDefault();
              window.location.href = isLoggedIn
                ? "/dashboard/pricing"
                : `/auth/signup?plan=${plan}`;
            });
            if (el.tagName === "A")
              (el as HTMLAnchorElement).href = isLoggedIn
                ? "/dashboard/pricing"
                : `/auth/signup?plan=${plan}`;
          } else if (text.includes("try for free")) {
            // Nav "Try for free" → "Dashboard" for logged-in users
            if (isLoggedIn) {
              el.textContent = "Dashboard";
              el.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.href = "/dashboard/create";
              });
              if (el.tagName === "A")
                (el as HTMLAnchorElement).href = "/dashboard/create";
            } else {
              el.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.href = "/auth/signup";
              });
              if (el.tagName === "A")
                (el as HTMLAnchorElement).href = "/auth/signup";
            }
          } else if (
            text.includes("create your first") ||
            text.includes("start free") ||
            text.includes("start toasting") ||
            text.includes("get started")
          ) {
            // Other CTAs → "Start Toasting" for logged-in, signup for logged-out
            if (isLoggedIn) {
              el.textContent = "Start Toasting";
              el.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.href = "/dashboard/create";
              });
              if (el.tagName === "A")
                (el as HTMLAnchorElement).href = "/dashboard/create";
            } else {
              el.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.href = "/auth/signup";
              });
              if (el.tagName === "A")
                (el as HTMLAnchorElement).href = "/auth/signup";
            }
          }
        });
      } catch {
        // cross-origin iframe, ignore
      }
    };

    iframe.addEventListener("load", handleLoad);
    // Re-run when auth state resolves
    if (iframe.contentDocument?.readyState === "complete") handleLoad();
    return () => iframe.removeEventListener("load", handleLoad);
  }, [isLoggedIn]);

  return (
    <iframe
      ref={iframeRef}
      src="/index.html"
      style={{
        width: "100vw",
        height: "100vh",
        border: "none",
        display: "block",
      }}
    />
  );
}
