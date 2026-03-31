"use client";

import { useState } from "react";

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/polar/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Failed to open portal:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        fontFamily: "'Rowdies', cursive",
        fontSize: "0.8rem",
        color: "var(--ink)",
        background: "transparent",
        border: "2px solid var(--ink)",
        padding: "8px 20px",
        borderRadius: "10px",
        cursor: loading ? "wait" : "pointer",
        transition: "all 0.2s",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? "Loading..." : "Manage Plan"}
    </button>
  );
}
