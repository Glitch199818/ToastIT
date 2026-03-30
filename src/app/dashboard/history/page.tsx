"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ToastyNap } from "@/components/dashboard/Toasty";

interface Card {
  id: string;
  drink: string;
  milestone_number: string;
  milestone_type: string;
  handle: string;
  image_url: string | null;
  created_at: string;
}

function HistoryCard({ card, onDelete }: { card: Card; onDelete: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);

  const handleRedownload = () => {
    if (!card.image_url) return;
    const link = document.createElement("a");
    link.download = `toastit-${card.milestone_number}-${card.milestone_type.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = card.image_url;
    link.target = "_blank";
    link.click();
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        transform: hovered ? "rotate(-1.5deg) scale(1.02)" : "none",
        boxShadow: hovered
          ? "6px 8px 20px rgba(0,0,0,.15)"
          : "3px 4px 10px rgba(0,0,0,.08)",
        borderRadius: "0",
        overflow: "hidden",
        aspectRatio: "1336 / 800",
        background: "#f5f5f5",
      }}
    >
      {card.image_url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={card.image_url}
          alt={`${card.milestone_number} ${card.milestone_type}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Oxygen', sans-serif",
            fontSize: "0.8rem",
            color: "var(--im)",
          }}
        >
          No image stored
        </div>
      )}

      {/* Hover overlay with download + delete */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            gap: "6px",
          }}
        >
          {card.image_url && (
            <button
              onClick={(e) => { e.stopPropagation(); handleRedownload(); }}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(255,255,255,.9)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}
              title="Download"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(255,255,255,.9)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)",
            }}
            title="Delete"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      )}

      {/* Date label */}
      <div
        style={{
          position: "absolute",
          bottom: "8px",
          left: "10px",
          fontFamily: "'Oxygen', sans-serif",
          fontSize: "0.6rem",
          color: "rgba(255,255,255,.85)",
          background: "rgba(0,0,0,.35)",
          padding: "2px 8px",
          borderRadius: "4px",
          backdropFilter: "blur(4px)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        {new Date(card.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setCards(data);
      setLoading(false);
    };
    fetchCards();
  }, []);

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    const card = cards.find((c) => c.id === id);
    // Delete image from storage if it exists
    if (card?.image_url) {
      const path = card.image_url.split("/card-images/")[1];
      if (path) {
        await supabase.storage.from("card-images").remove([path]);
      }
    }
    await supabase.from("cards").delete().eq("id", id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div style={{ padding: "32px 36px" }}>
      {/* Header with Create button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1
          style={{
            fontFamily: "'Kanit', sans-serif",
            fontWeight: 700,
            fontSize: "2.125rem",
            color: "var(--ink)",
          }}
        >
          History
        </h1>
        <Link
          href="/dashboard/create"
          style={{
            fontFamily: "'Rowdies', cursive",
            fontSize: "0.8rem",
            color: "var(--ink)",
            background: "var(--pink)",
            border: "2px solid var(--ink)",
            padding: "8px 18px",
            borderRadius: "10px",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "1rem", fontWeight: 700 }}>+</span> Create New
        </Link>
      </div>

      {loading ? (
        <p style={{ fontFamily: "'Oxygen', sans-serif", color: "var(--im)" }}>
          Loading...
        </p>
      ) : cards.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: "48px" }}>
          <ToastyNap size={100} />
          <p style={{
            fontFamily: "'Oxygen', sans-serif",
            fontSize: "0.85rem",
            color: "var(--im)",
            margin: "16px auto 0",
          }}>
            Create and download your first card to see it here.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {cards.map((card) => (
            <HistoryCard key={card.id} card={card} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
