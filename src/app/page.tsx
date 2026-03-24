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

        // Find all buttons/links with text like "Try for free", "Create your first doodle", "Start free", "Go Pro"
        doc.querySelectorAll("a, button").forEach((el) => {
          const text = el.textContent?.toLowerCase() || "";
          if (
            text.includes("try for free") ||
            text.includes("create your first") ||
            text.includes("start free") ||
            text.includes("get started")
          ) {
            el.addEventListener("click", (e) => {
              e.preventDefault();
              window.location.href = "/coming-soon";
            });
            if (el.tagName === "A") (el as HTMLAnchorElement).href = "/coming-soon";
          } else if (text.includes("go pro")) {
            el.addEventListener("click", (e) => {
              e.preventDefault();
              window.location.href = "/coming-soon";
            });
            if (el.tagName === "A") (el as HTMLAnchorElement).href = "/coming-soon";
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
