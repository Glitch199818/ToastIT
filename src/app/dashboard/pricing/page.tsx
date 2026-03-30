"use client";

import { useState } from "react";

export default function PricingPage() {
  const [loading, setLoading] = useState<"monthly" | "annual" | null>(null);

  const handleUpgrade = async (plan: "monthly" | "annual") => {
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
    <div style={{ padding: "32px 36px" }}>
      <h1
        style={{
          fontFamily: "'Kanit', sans-serif",
          fontWeight: 700,
          fontSize: "2.125rem",
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
          marginBottom: "16px",
        }}
      >
        Unlock the full ToastIT experience
      </p>
      <p
        style={{
          fontFamily: "'Oxygen', sans-serif",
          fontSize: "0.85rem",
          color: "var(--pink)",
          fontWeight: 600,
          marginBottom: "32px",
        }}
      >
        Launch pricing — lock in these prices before they go up!
      </p>

      <div style={{ display: "flex", gap: "24px", maxWidth: "700px" }}>
        {/* Monthly */}
        <div
          style={{
            flex: 1,
            background: "var(--w)",
            borderRadius: "14px",
            padding: "32px 28px",
            border: "2px solid var(--ink)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Ribbon.png"
            alt="Launch offer"
            style={{
              position: "absolute",
              top: "-55px",
              right: "-55px",
              width: "180px",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
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
          <div style={{ marginBottom: "6px" }}>
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
          <p
            style={{
              fontFamily: "'Oxygen', sans-serif",
              fontSize: "0.75rem",
              color: "var(--im)",
              marginBottom: "20px",
            }}
          >
            or $48/year
          </p>

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
              "All drink designs (10+)",
              "New doodles every week",
              "Request custom drinks",
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
              color: "var(--w)",
              background: "var(--pink)",
              border: "2px solid var(--ink)",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: loading ? "wait" : "pointer",
              transition: "all 0.2s",
              width: "100%",
            }}
          >
            {loading === "monthly" ? "Loading..." : "Subscribe Monthly"}
          </button>
        </div>

        {/* Annual */}
        <div
          style={{
            flex: 1,
            background: "var(--pink)",
            borderRadius: "14px",
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
            Save 20%
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
            Annual
          </p>
          <div style={{ marginBottom: "6px" }}>
            <span
              style={{
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 700,
                fontSize: "2.4rem",
                color: "var(--ink)",
              }}
            >
              $4
            </span>
            <span
              style={{
                fontFamily: "'Oxygen', sans-serif",
                fontSize: "0.9rem",
                color: "var(--ink)",
                opacity: 0.8,
              }}
            >
              /mo
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Oxygen', sans-serif",
              fontSize: "0.75rem",
              color: "var(--ink)",
              opacity: 0.7,
              marginBottom: "20px",
            }}
          >
            $48 billed annually
          </p>

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
              "20% cheaper than monthly",
              "All future doodles & features",
              "Request custom drinks",
              "Priority support",
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
            onClick={() => handleUpgrade("annual")}
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
            {loading === "annual" ? "Loading..." : "Subscribe Annually"}
          </button>
        </div>
      </div>
    </div>
  );
}
