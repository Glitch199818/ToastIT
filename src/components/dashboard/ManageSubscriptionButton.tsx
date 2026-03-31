"use client";

import { useState, useEffect } from "react";

interface SubInfo {
  id: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  productId: string;
}

export default function ManageSubscriptionButton() {
  const [sub, setSub] = useState<SubInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    fetch("/api/polar/portal")
      .then((r) => r.json())
      .then((data) => {
        if (data.subscription) {
          setSub(data.subscription);
          if (data.subscription.cancelAtPeriodEnd) setCancelled(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch("/api/polar/portal", { method: "POST" });
      if (res.ok) {
        setCancelled(true);
        setShowModal(false);
      }
    } catch (err) {
      console.error("Cancel failed:", err);
    } finally {
      setCancelling(false);
    }
  };

  const periodEnd = sub?.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  if (loading) {
    return (
      <div
        style={{
          width: "100px",
          height: "36px",
          background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
          borderRadius: "10px",
        }}
      />
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          fontFamily: "'Rowdies', cursive",
          fontSize: "0.8rem",
          color: "var(--ink)",
          background: "transparent",
          border: "2px solid var(--ink)",
          padding: "8px 20px",
          borderRadius: "10px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        Manage Plan
      </button>

      {/* Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--w)",
              border: "2px solid var(--ink)",
              borderRadius: "16px",
              padding: "32px",
              width: "380px",
              maxWidth: "90vw",
            }}
          >
            <h2
              style={{
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "var(--ink)",
                marginBottom: "20px",
              }}
            >
              Manage Subscription
            </h2>

            {/* Status */}
            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  fontFamily: "'Oxygen', sans-serif",
                  fontSize: "0.8rem",
                  color: "var(--im)",
                  marginBottom: "4px",
                }}
              >
                Status
              </p>
              <p
                style={{
                  fontFamily: "'Kanit', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: cancelled ? "var(--im)" : "var(--ink)",
                }}
              >
                {cancelled ? "Cancelling" : "Active"}
              </p>
            </div>

            {/* Renewal */}
            {periodEnd && (
              <div style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    fontFamily: "'Oxygen', sans-serif",
                    fontSize: "0.8rem",
                    color: "var(--im)",
                    marginBottom: "4px",
                  }}
                >
                  {cancelled ? "Pro access until" : "Next billing date"}
                </p>
                <p
                  style={{
                    fontFamily: "'Kanit', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "var(--ink)",
                  }}
                >
                  {periodEnd}
                </p>
              </div>
            )}

            {/* Actions */}
            {cancelled ? (
              <p
                style={{
                  fontFamily: "'Oxygen', sans-serif",
                  fontSize: "0.85rem",
                  color: "var(--im)",
                  lineHeight: 1.5,
                }}
              >
                Your subscription will end on {periodEnd}. You&apos;ll keep Pro
                access until then.
              </p>
            ) : (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                style={{
                  fontFamily: "'Rowdies', cursive",
                  fontSize: "0.8rem",
                  color: "var(--pink)",
                  background: "transparent",
                  border: "2px solid var(--pink)",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  cursor: cancelling ? "wait" : "pointer",
                  transition: "all 0.2s",
                  opacity: cancelling ? 0.6 : 1,
                  width: "100%",
                }}
              >
                {cancelling ? "Cancelling..." : "Cancel Subscription"}
              </button>
            )}

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                fontFamily: "'Oxygen', sans-serif",
                fontSize: "0.8rem",
                color: "var(--im)",
                background: "none",
                border: "none",
                cursor: "pointer",
                marginTop: "16px",
                width: "100%",
                textAlign: "center",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </>
  );
}
