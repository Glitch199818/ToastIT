"use client";

import { useState } from "react";

export default function PricingPage() {
  const [loading, setLoading] = useState<"monthly" | "lifetime" | null>(null);

  const handleUpgrade = async (plan: "monthly" | "lifetime") => {
    setLoading(plan);
    try {
      const res = await fetch("/api/polar/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ padding: "32px 40px" }}>
      <h1
        style={{
          fontFamily: "'Odor Mean Chey', serif",
          fontWeight: 400,
          fontSize: "1.8rem",
          color: "var(--ink)",
          marginBottom: "8px",
        }}
      >
        Go Pro
      </h1>
      <p
        style={{
          fontFamily: "'Oxygen', sans-serif",
          fontSize: "0.95rem",
          color: "var(--im)",
          marginBottom: "40px",
        }}
      >
        Unlock the full ToastIT experience
      </p>

      <div style={{ display: "flex", gap: "24px", maxWidth: "700px" }}>
        {/* Monthly */}
        <div
          style={{
            flex: 1,
            background: "var(--w)",
            borderRadius: "20px",
            padding: "32px 28px",
            border: "2px solid rgba(0,0,0,.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "var(--im)",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Monthly
          </p>
          <div style={{ marginBottom: "20px" }}>
            <span
              style={{
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 700,
                fontSize: "2.4rem",
                color: "var(--ink)",
              }}
            >
              $5
            </span>
            <span
              style={{
                fontFamily: "'Oxygen', sans-serif",
                fontSize: "0.9rem",
                color: "var(--im)",
              }}
            >
              /mo
            </span>
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              marginBottom: "28px",
              flex: 1,
            }}
          >
            {[
              "Unlimited card exports",
              "No watermark",
              "All 10 drink designs",
              "Future doodles included",
              "Cancel anytime",
            ].map((item) => (
              <li
                key={item}
                style={{
                  fontFamily: "'Oxygen', sans-serif",
                  fontSize: "0.85rem",
                  color: "var(--ink)",
                  padding: "6px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ color: "var(--pink)", fontWeight: 700 }}>&#10003;</span>
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleUpgrade("monthly")}
            disabled={loading !== null}
            style={{
              fontFamily: "'Rowdies', cursive",
              fontSize: "0.85rem",
              color: "var(--ink)",
              background: "transparent",
              border: "2px solid var(--ink)",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: loading ? "wait" : "pointer",
              transition: "all 0.2s",
              width: "100%",
            }}
          >
            {loading === "monthly" ? "Loading..." : "Subscribe"}
          </button>
        </div>

        {/* Lifetime */}
        <div
          style={{
            flex: 1,
            background: "var(--pink)",
            borderRadius: "20px",
            padding: "32px 28px",
            border: "2px solid var(--ink)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-12px",
              right: "20px",
              background: "var(--ink)",
              color: "var(--w)",
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 700,
              fontSize: "0.65rem",
              padding: "4px 12px",
              borderRadius: "20px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Best value
          </div>

          <p
            style={{
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "var(--ink)",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Lifetime
          </p>
          <div style={{ marginBottom: "20px" }}>
            <span
              style={{
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 700,
                fontSize: "2.4rem",
                color: "var(--ink)",
              }}
            >
              $29
            </span>
            <span
              style={{
                fontFamily: "'Oxygen', sans-serif",
                fontSize: "0.9rem",
                color: "var(--ink)",
                opacity: 0.7,
              }}
            >
              {" "}one-time
            </span>
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              marginBottom: "28px",
              flex: 1,
            }}
          >
            {[
              "Everything in Monthly",
              "Pay once, use forever",
              "All future doodles & features",
              "Priority support",
              "No recurring charges",
            ].map((item) => (
              <li
                key={item}
                style={{
                  fontFamily: "'Oxygen', sans-serif",
                  fontSize: "0.85rem",
                  color: "var(--ink)",
                  padding: "6px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontWeight: 700 }}>&#10003;</span>
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleUpgrade("lifetime")}
            disabled={loading !== null}
            style={{
              fontFamily: "'Rowdies', cursive",
              fontSize: "0.85rem",
              color: "var(--w)",
              background: "var(--ink)",
              border: "2px solid var(--ink)",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: loading ? "wait" : "pointer",
              transition: "all 0.2s",
              width: "100%",
            }}
          >
            {loading === "lifetime" ? "Loading..." : "Get Lifetime Access"}
          </button>
        </div>
      </div>
    </div>
  );
}
