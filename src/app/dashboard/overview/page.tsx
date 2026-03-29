"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function OverviewPage() {
  const [userName, setUserName] = useState("");
  const [totalCards, setTotalCards] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [recentCards, setRecentCards] = useState<
    Array<{
      id: string;
      drink: string;
      milestone_number: string;
      milestone_type: string;
      image_url: string | null;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get first name
      const fullName = user.user_metadata?.full_name || user.email || "";
      setUserName(fullName.split(" ")[0]);

      // Total cards
      const { count } = await supabase
        .from("cards")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Recent cards
      const { data: recent } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);

      // Calculate streak (consecutive days with cards)
      const { data: allCards } = await supabase
        .from("cards")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      let currentStreak = 0;
      if (allCards && allCards.length > 0) {
        const dates = [...new Set(allCards.map(c => new Date(c.created_at).toDateString()))];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < dates.length; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);
          if (dates.includes(checkDate.toDateString())) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      // Check pro status
      try {
        const res = await fetch("/api/polar/status");
        const data = await res.json();
        setIsPro(data.isPro);
      } catch {}

      setTotalCards(count || 0);
      setStreak(currentStreak);
      setRecentCards(recent || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <p style={{ fontFamily: "'Oxygen', sans-serif", color: "var(--im)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 8px" }}>
      {/* Welcome + Create Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: "1.8rem", color: "var(--ink)", marginBottom: "2px" }}>
            Hey, {userName}!
          </h1>
          <p style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.9rem", color: "var(--im)" }}>
            Ready to toast your next milestone?
          </p>
        </div>
        <Link href="/dashboard/create" style={{
          fontFamily: "'Rowdies', cursive",
          fontSize: "0.85rem",
          color: "var(--ink)",
          background: "var(--pink)",
          border: "2px solid var(--ink)",
          padding: "10px 20px",
          borderRadius: "10px",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          whiteSpace: "nowrap",
        }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>+</span> Create New
        </Link>
      </div>

      {/* Banner */}
      <div style={{
        background: "linear-gradient(135deg, var(--pink) 0%, #FFD6C0 100%)",
        border: "2px solid var(--ink)",
        borderRadius: "14px",
        padding: "20px 24px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
      }}>
        <div>
          <p style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--ink)", marginBottom: "4px" }}>
            New drinks just dropped!
          </p>
          <p style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.8rem", color: "var(--ink)", opacity: 0.8, lineHeight: 1.4 }}>
            Espresso Martini, Pina Colada & more are now available. Try them out!
          </p>
        </div>
        <Link href="/dashboard/create" style={{
          fontFamily: "'Rowdies', cursive",
          fontSize: "0.75rem",
          color: "var(--ink)",
          background: "var(--w)",
          border: "2px solid var(--ink)",
          padding: "8px 16px",
          borderRadius: "8px",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}>
          Try now
        </Link>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "32px", flexWrap: "wrap" }}>
        {/* Total Collection */}
        <div style={{
          flex: "1 1 150px",
          background: "var(--w)",
          border: "2px solid var(--ink)",
          borderRadius: "12px",
          padding: "18px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--im)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            <p style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.75rem", color: "var(--im)" }}>Collection</p>
          </div>
          <p style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: "2rem", color: "var(--ink)" }}>{totalCards}</p>
          <p style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.7rem", color: "var(--im)" }}>total toasts</p>
        </div>

        {/* Current Plan */}
        <div style={{
          flex: "1 1 150px",
          background: isPro ? "var(--pink)" : "var(--w)",
          border: "2px solid var(--ink)",
          borderRadius: "12px",
          padding: "18px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isPro ? "var(--ink)" : "var(--im)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <p style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.75rem", color: isPro ? "var(--ink)" : "var(--im)", opacity: isPro ? 0.8 : 1 }}>Plan</p>
          </div>
          <p style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: "1.6rem", color: "var(--ink)" }}>
            {isPro ? "Pro" : "Free"}
          </p>
          {!isPro && (
            <Link href="/dashboard/pricing" style={{
              fontFamily: "'Oxygen', sans-serif",
              fontSize: "0.7rem",
              color: "var(--pink)",
              textDecoration: "underline",
            }}>
              Upgrade →
            </Link>
          )}
          {isPro && (
            <p style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.7rem", color: "var(--ink)", opacity: 0.7 }}>no watermarks</p>
          )}
        </div>

        {/* Streak */}
        <div style={{
          flex: "1 1 150px",
          background: "var(--w)",
          border: "2px solid var(--ink)",
          borderRadius: "12px",
          padding: "18px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--im)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <p style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.75rem", color: "var(--im)" }}>Streak</p>
          </div>
          <p style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: "2rem", color: "var(--ink)" }}>
            {streak}
          </p>
          <p style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.7rem", color: "var(--im)" }}>
            {streak === 0 ? "create today!" : streak === 1 ? "day" : "days"}
          </p>
        </div>
      </div>

      {/* Recent Toasts */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--ink)" }}>
          Recent Toasts
        </h2>
        {recentCards.length > 0 && (
          <Link href="/dashboard/history" style={{
            fontFamily: "'Oxygen', sans-serif",
            fontSize: "0.8rem",
            color: "var(--im)",
            textDecoration: "none",
          }}>
            View all →
          </Link>
        )}
      </div>

      {recentCards.length === 0 ? (
        <div style={{
          background: "var(--w)",
          border: "2px solid rgba(0,0,0,0.06)",
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
        }}>
          <p style={{ fontFamily: "'Oxygen', sans-serif", color: "var(--im)", marginBottom: "4px", fontSize: "1.2rem" }}></p>
          <p style={{ fontFamily: "'Oxygen', sans-serif", color: "var(--im)", marginBottom: "12px" }}>No toasts yet</p>
          <Link href="/dashboard/create" style={{
            fontFamily: "'Rowdies', cursive",
            fontSize: "0.85rem",
            color: "var(--ink)",
            background: "var(--pink)",
            border: "2px solid var(--ink)",
            padding: "8px 20px",
            borderRadius: "8px",
            textDecoration: "none",
          }}>
            Create your first toast
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px" }}>
          {recentCards.map((card) => (
            <div key={card.id} style={{
              background: "var(--w)",
              border: "2px solid rgba(0,0,0,0.06)",
              borderRadius: "12px",
              overflow: "hidden",
              transition: "transform 0.2s",
            }}>
              {card.image_url ? (
                <img
                  src={card.image_url}
                  alt={`${card.drink} card`}
                  style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div style={{
                  width: "100%",
                  aspectRatio: "1",
                  background: "var(--bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <span style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.75rem", color: "var(--im)" }}>No preview</span>
                </div>
              )}
              <div style={{ padding: "10px 12px" }}>
                <p style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "var(--ink)", textTransform: "capitalize" }}>
                  {card.drink?.replace(/_/g, " ")}
                </p>
                <p style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.7rem", color: "var(--im)" }}>
                  {card.milestone_number} {card.milestone_type}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
