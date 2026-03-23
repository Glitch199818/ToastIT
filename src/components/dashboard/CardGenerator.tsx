/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas-pro";
import CardPreview from "./CardPreview";
import { createClient } from "@/lib/supabase/client";

const DRINKS = [
  { id: "champagne", name: "Champagne" },
  { id: "cocktail", name: "Cocktail" },
  { id: "cosmo", name: "Cosmo" },
  { id: "espresso_martini", name: "Espresso Martini" },
  { id: "iced_coffee", name: "Iced Coffee" },
  { id: "margarita", name: "Margarita" },
  { id: "mimosa", name: "Mimosa" },
  { id: "mojito", name: "Mojito" },
  { id: "pina_colada", name: "Pina Colada" },
  { id: "wine", name: "Wine" },
];

const MILESTONE_CATEGORIES = [
  {
    group: "X / Social",
    options: [
      "Followers",
      "Impressions",
      "Likes",
      "Reposts",
      "Subscribers",
    ],
  },
  {
    group: "SaaS / Business",
    options: [
      "First MRR",
      "Revenue",
      "Customers",
      "Users",
      "Waitlist",
      "Downloads",
    ],
  },
  {
    group: "Builder",
    options: [
      "Shipped!",
      "Stars",
      "Launches",
      "Contributors",
    ],
  },
];

const labelStyle = {
  fontFamily: "'Kanit', sans-serif",
  fontWeight: 700 as const,
  fontSize: "0.9rem",
  color: "var(--ink)",
  display: "block" as const,
  marginBottom: "8px",
};

const inputStyle = {
  padding: "10px 12px",
  background: "var(--bg)",
  border: "1.5px solid rgba(0,0,0,.08)",
  borderRadius: "10px",
  fontFamily: "'Oxygen', sans-serif",
  fontSize: "0.85rem",
  color: "var(--ink)",
  outline: "none",
  transition: "border-color 0.2s",
};

export default function CardGenerator() {
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [milestoneType, setMilestoneType] = useState("");
  const [milestoneNumber, setMilestoneNumber] = useState("");
  const [handle, setHandle] = useState("");
  const [drinkSize, setDrinkSize] = useState(100);
  const [numberSize, setNumberSize] = useState(100);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const canExport = selectedDrink && milestoneNumber && milestoneType;

  const handleExport = async () => {
    if (!cardRef.current || !canExport) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const dataUrl = canvas.toDataURL("image/png");

      // Download
      const link = document.createElement("a");
      link.download = `toastit-${milestoneNumber}-${milestoneType.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();

      // Save to history
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("cards").insert({
          user_id: user.id,
          drink: selectedDrink,
          milestone_number: milestoneNumber,
          milestone_type: milestoneType,
          handle,
          drink_size: drinkSize,
          number_size: numberSize,
        });
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
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
        Create your card
      </h1>

      <div style={{ display: "flex", gap: "40px", alignItems: "stretch" }}>
        {/* Left: Controls */}
        <div style={{ flex: "0 0 400px", display: "flex", flexDirection: "column" }}>
          {/* Pick a drink */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Pick your drink</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "6px",
              }}
            >
              {DRINKS.map((drink) => {
                const isSelected = selectedDrink === drink.id;
                return (
                  <button
                    key={drink.id}
                    onClick={() => setSelectedDrink(drink.id)}
                    style={{
                      background: isSelected ? "var(--pink)" : "var(--w)",
                      border: "2px solid",
                      borderColor: isSelected ? "var(--ink)" : "rgba(0,0,0,.06)",
                      borderRadius: "10px",
                      padding: "6px 2px 4px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "2px",
                    }}
                  >
                    <img
                      src={`/doodles/${drink.id}.png`}
                      alt={drink.name}
                      style={{
                        width: "36px",
                        height: "36px",
                        objectFit: "contain",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Oxygen', sans-serif",
                        fontSize: "0.55rem",
                        color: "var(--ink)",
                        fontWeight: isSelected ? 700 : 400,
                        lineHeight: 1.2,
                        textAlign: "center",
                      }}
                    >
                      {drink.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Your milestone */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Your milestone</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <select
                value={milestoneType}
                onChange={(e) => setMilestoneType(e.target.value)}
                style={{
                  ...inputStyle,
                  flex: "0 0 120px",
                  color: milestoneType ? "var(--ink)" : "var(--il)",
                  cursor: "pointer",
                  appearance: "none" as const,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%234A4A4A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  paddingRight: "28px",
                }}
              >
                <option value="" disabled>
                  Type
                </option>
                {MILESTONE_CATEGORIES.map((cat) => (
                  <optgroup key={cat.group} label={cat.group}>
                    {cat.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <input
                type="text"
                value={milestoneNumber}
                onChange={(e) => setMilestoneNumber(e.target.value)}
                placeholder="e.g. 1K, $500"
                maxLength={10}
                style={{
                  ...inputStyle,
                  flex: 1,
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--pink)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,.08)")}
              />
            </div>
          </div>

          {/* Adjust sizes */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Adjust card</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.75rem", color: "var(--ink)", width: "70px", flexShrink: 0 }}>Drink size</span>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={drinkSize}
                  onChange={(e) => setDrinkSize(Number(e.target.value))}
                  style={{ flex: 1, accentColor: "var(--pink)", cursor: "pointer" }}
                />
                <span style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.7rem", color: "var(--il)", width: "32px", textAlign: "right" }}>{drinkSize}%</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.75rem", color: "var(--ink)", width: "70px", flexShrink: 0 }}>Number size</span>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={numberSize}
                  onChange={(e) => setNumberSize(Number(e.target.value))}
                  style={{ flex: 1, accentColor: "var(--pink)", cursor: "pointer" }}
                />
                <span style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.7rem", color: "var(--il)", width: "32px", textAlign: "right" }}>{numberSize}%</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* X Handle */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>X handle</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@yourhandle"
              maxLength={30}
              style={{
                ...inputStyle,
                width: "100%",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--pink)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,.08)")}
            />
          </div>

          {/* Download Button */}
          <button
            onClick={handleExport}
            disabled={!canExport || isExporting}
            style={{
              width: "100%",
              padding: "12px 24px",
              fontFamily: "'Rowdies', cursive",
              fontSize: "0.9rem",
              color: canExport ? "var(--ink)" : "var(--il)",
              background: canExport ? "var(--pink)" : "rgba(0,0,0,.03)",
              border: canExport
                ? "2px solid var(--ink)"
                : "1.5px solid rgba(0,0,0,.08)",
              borderRadius: "10px",
              cursor: canExport ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {isExporting ? "Exporting..." : "Download Card"}
          </button>
        </div>

        {/* Right: Live Preview */}
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <CardPreview
            ref={cardRef}
            drink={selectedDrink}
            milestone={milestoneNumber}
            milestoneLabel={milestoneType}
            handle={handle}
            drinkSize={drinkSize}
            numberSize={numberSize}
          />
        </div>
      </div>
    </div>
  );
}
