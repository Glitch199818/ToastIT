"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import html2canvas from "html2canvas-pro";
import CardPreview from "@/components/dashboard/CardPreview";

interface Card {
  id: string;
  drink: string;
  milestone_number: string;
  milestone_type: string;
  handle: string;
  drink_size: number;
  number_size: number;
  created_at: string;
}

function HistoryCard({ card, onDelete }: { card: Card; onDelete: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleRedownload = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });
    const link = document.createElement("a");
    link.download = `toastit-${card.milestone_number}-${card.milestone_type.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
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
        transform: hovered ? "rotate(-2deg) scale(1.02)" : "none",
        boxShadow: hovered
          ? "6px 8px 20px rgba(0,0,0,.15)"
          : "3px 4px 10px rgba(0,0,0,.08)",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <CardPreview
        ref={cardRef}
        drink={card.drink}
        milestone={card.milestone_number}
        milestoneLabel={card.milestone_type}
        handle={card.handle}
        drinkSize={card.drink_size || 100}
        numberSize={card.number_size || 100}
      />

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
    await supabase.from("cards").delete().eq("id", id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div style={{ padding: "32px 36px" }}>
      <h1
        style={{
          fontFamily: "'Odor Mean Chey', serif",
          fontWeight: 400,
          fontSize: "1.6rem",
          color: "var(--ink)",
          marginBottom: "24px",
        }}
      >
        History
      </h1>

      {loading ? (
        <p style={{ fontFamily: "'Oxygen', sans-serif", color: "var(--il)" }}>
          Loading...
        </p>
      ) : cards.length === 0 ? (
        <div
          style={{
            background: "var(--w)",
            borderRadius: "16px",
            padding: "48px",
            border: "1.5px solid rgba(0,0,0,.05)",
            textAlign: "center",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--il)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginBottom: "12px", opacity: 0.5 }}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.95rem", color: "var(--im)", marginBottom: "4px" }}>
            No cards yet.
          </p>
          <p style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.8rem", color: "var(--il)" }}>
            Create and download your first card to see it here.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
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
