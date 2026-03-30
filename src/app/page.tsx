"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
              window.location.href = `/auth/signup?plan=${plan}`;
            });
            if (el.tagName === "A")
              (el as HTMLAnchorElement).href = `/auth/signup?plan=${plan}`;
          } else if (
            text.includes("try for free") ||
            text.includes("create your first") ||
            text.includes("start free") ||
            text.includes("get started")
          ) {
            el.addEventListener("click", (e) => {
              e.preventDefault();
              window.location.href = "/auth/signup";
            });
            if (el.tagName === "A")
              (el as HTMLAnchorElement).href = "/auth/signup";
          }
        });
      } catch {
        // cross-origin iframe, ignore
      }
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, []);

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
