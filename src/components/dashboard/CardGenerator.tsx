/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import CardPreview from "./CardPreview";
import { ToastyStatic } from "./Toasty";
import { createClient } from "@/lib/supabase/client";

const FREE_DRINKS = [
  { id: "champagne", name: "Champagne" },
  { id: "cosmo", name: "Cosmo" },
  { id: "iced_coffee", name: "Iced Coffee" },
  { id: "margarita", name: "Margarita" },
  { id: "mojito", name: "Mojito" },
];

const DRINK_CATEGORIES = [
  {
    group: "Cocktails",
    drinks: [
      { id: "cosmo", name: "Cosmo" },
      { id: "cocktail", name: "Cocktail" },
      { id: "margarita", name: "Margarita" },
    ],
  },
  {
    group: "Bubbly",
    drinks: [
      { id: "champagne", name: "Champagne" },
      { id: "mimosa", name: "Mimosa" },
    ],
  },
  {
    group: "Coffee",
    drinks: [
      { id: "iced_coffee", name: "Iced Coffee" },
      { id: "espresso_martini", name: "Espresso Martini" },
    ],
  },
  {
    group: "Tropical",
    drinks: [
      { id: "mojito", name: "Mojito" },
      { id: "pina_colada", name: "Pina Colada" },
    ],
  },
  {
    group: "Wine",
    drinks: [
      { id: "wine", name: "Wine" },
    ],
  },
];

const ALL_DRINKS = DRINK_CATEGORIES.flatMap((c) => c.drinks);

const MILESTONE_CATEGORIES = [
  {
    group: "X",
    options: [
      "Followers",
      "Verified Followers",
      "Impressions",
      "Subscribers",
    ],
  },
  {
    group: "SaaS",
    options: [
      "MRR",
      "ARR",
      "Visitors",
      "Users",
      "Sales",
      "Valuation",
      "Acquired",
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
  border: "2px solid var(--ink)",
  borderRadius: "10px",
  fontFamily: "'Oxygen', sans-serif",
  fontSize: "0.85rem",
  color: "var(--ink)",
  outline: "none",
  transition: "border-color 0.2s",
};

function MilestoneDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setHoveredGroup(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flex: "0 0 160px" }}>
      <button
        onClick={() => { setOpen(!open); setHoveredGroup(null); }}
        style={{
          ...inputStyle,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          color: value ? "var(--ink)" : "var(--il)",
          background: "var(--bg)",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || "Type"}
        </span>
        <svg width="10" height="6" viewBox="0 0 12 8" fill="none" style={{ flexShrink: 0, marginLeft: "6px", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M1 1.5L6 6.5L11 1.5" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            width: "150px",
            background: "var(--w)",
            border: "2px solid var(--ink)",
            borderRadius: "12px",
            padding: "6px 0",
            zIndex: 50,
            boxShadow: "0 8px 24px rgba(0,0,0,.1)",
          }}
        >
          {MILESTONE_CATEGORIES.map((cat) => (
            <div
              key={cat.group}
              style={{ position: "relative" }}
              onMouseEnter={() => setHoveredGroup(cat.group)}
              onMouseLeave={() => setHoveredGroup(null)}
            >
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "9px 14px",
                  border: "none",
                  background: hoveredGroup === cat.group ? "var(--pink)" : "transparent",
                  fontFamily: "'Kanit', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "var(--ink)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
              >
                {cat.group}
                <svg width="8" height="10" viewBox="0 0 8 12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M1.5 1L6.5 6L1.5 11" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Submenu */}
              {hoveredGroup === cat.group && (
                <div
                  style={{
                    position: "absolute",
                    top: "-6px",
                    left: "calc(100% + 4px)",
                    width: "170px",
                    background: "var(--w)",
                    border: "2px solid var(--ink)",
                    borderRadius: "12px",
                    padding: "6px 0",
                    boxShadow: "0 8px 24px rgba(0,0,0,.1)",
                    zIndex: 51,
                  }}
                >
                  {cat.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { onChange(opt); setOpen(false); setHoveredGroup(null); }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "8px 14px",
                        border: "none",
                        background: value === opt ? "var(--pink)" : "transparent",
                        fontFamily: "'Oxygen', sans-serif",
                        fontSize: "0.82rem",
                        fontWeight: value === opt ? 700 : 400,
                        color: "var(--ink)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.background = "var(--pink)"; }}
                      onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.background = "transparent"; }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CardGenerator({ isPro = false }: { isPro?: boolean }) {
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [freeLimitReached, setFreeLimitReached] = useState(false);
  const [checkingLimit, setCheckingLimit] = useState(!isPro);

  // Default to champagne on mount (avoids hydration mismatch)
  useEffect(() => {
    setSelectedDrink((prev) => prev || "champagne");
  }, []);

  // Check free plan limit on mount
  useEffect(() => {
    if (isPro) { setCheckingLimit(false); return; }
    const checkLimit = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { count } = await supabase
          .from("cards")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        if (count && count >= 5) setFreeLimitReached(true);
      }
      setCheckingLimit(false);
    };
    checkLimit();
  }, [isPro]);

  const [milestoneType, setMilestoneType] = useState("");
  const [milestoneNumber, setMilestoneNumber] = useState("");
  const [handle, setHandle] = useState("");
  const [drinkSize, setDrinkSize] = useState(100);
  const [numberSize, setNumberSize] = useState(100);
  const [isExporting, setIsExporting] = useState(false);
  const [exportLimitHit, setExportLimitHit] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [extraDrink, setExtraDrink] = useState<{ id: string; name: string } | null>(null);
  const [showLockedMsg, setShowLockedMsg] = useState(false);
  const [toastyDancing, setToastyDancing] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const drinkScrollRef = useRef<HTMLDivElement>(null);

  const updateScrollArrows = () => {
    const el = drinkScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  const scrollDrinks = (dir: "left" | "right") => {
    const el = drinkScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 200 : -200, behavior: "smooth" });
  };

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("toastit_favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (drinkId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(drinkId)
        ? prev.filter((id) => id !== drinkId)
        : [...prev, drinkId];
      localStorage.setItem("toastit_favorites", JSON.stringify(next));
      return next;
    });
  };

  const FREE_IDS = FREE_DRINKS.map((d) => d.id);

  const canExport = selectedDrink && milestoneNumber && milestoneType;

  const handleExport = async () => {
    if (!cardRef.current || !canExport) return;

    setIsExporting(true);
    setExportLimitHit(false);
    try {
      // Check export limit for free users (first 5 exports total)
      if (!isPro) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { count } = await supabase
            .from("cards")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);
          if (count && count >= 5) {
            setExportLimitHit(true);
            setIsExporting(false);
            return;
          }
        }
      }

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      // Add watermark for free users
      if (!isPro) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const fontSize = Math.round(canvas.width * 0.035);
          ctx.font = `600 ${fontSize}px Oxygen, sans-serif`;
          ctx.textAlign = "right";
          // Shadow for readability on any background
          ctx.fillStyle = "rgba(255,255,255,0.6)";
          ctx.fillText("Made with ToastIT", canvas.width - 20, canvas.height - 18);
          ctx.fillStyle = "rgba(0,0,0,0.35)";
          ctx.fillText("Made with ToastIT", canvas.width - 20, canvas.height - 18);
        }
      }

      // Convert to blob for both download and upload
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });

      // Download locally
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `toastit-${milestoneNumber}-${milestoneType.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = blobUrl;
      link.click();
      URL.revokeObjectURL(blobUrl);

      // Upload to Supabase Storage and save to history
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fileName = `${user.id}/${Date.now()}.png`;
        const { data: uploadData } = await supabase.storage
          .from("card-images")
          .upload(fileName, blob, { contentType: "image/png" });

        let imageUrl: string | null = null;
        if (uploadData?.path) {
          const { data: urlData } = supabase.storage
            .from("card-images")
            .getPublicUrl(uploadData.path);
          imageUrl = urlData.publicUrl;
        }

        await supabase.from("cards").insert({
          user_id: user.id,
          drink: selectedDrink,
          milestone_number: milestoneNumber,
          milestone_type: milestoneType,
          handle,
          drink_size: drinkSize,
          number_size: numberSize,
          image_url: imageUrl,
        });
      }
      // Toasty celebrates!
      setToastyDancing(true);
      setTimeout(() => setToastyDancing(false), 3000);
      // Show toast notification — stays until user closes it
      setShowToast(true);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  if (checkingLimit) {
    return (
      <div style={{ padding: "32px 36px" }}>
        <p style={{ fontFamily: "'Oxygen', sans-serif", color: "var(--im)" }}>Loading...</p>
      </div>
    );
  }

  if (freeLimitReached && !isPro) {
    return (
      <div style={{ padding: "32px 36px" }}>
        <h1
          style={{
            fontFamily: "'Kanit', sans-serif",
            fontWeight: 700,
            fontSize: "2.125rem",
            color: "var(--ink)",
            marginBottom: "24px",
          }}
        >
          Create your card
        </h1>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 40px",
          textAlign: "center",
          maxWidth: "500px",
          margin: "40px auto",
        }}>
          <ToastyStatic mood="holding-drink" size={100} />
          <p style={{
            fontFamily: "'Kanit', sans-serif",
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "var(--ink)",
            marginTop: "20px",
            marginBottom: "8px",
          }}>
            Free plan export limit reached
          </p>
          <p style={{
            fontFamily: "'Oxygen', sans-serif",
            fontSize: "0.85rem",
            color: "var(--im)",
            marginBottom: "24px",
            lineHeight: 1.5,
          }}>
            First 5 card exports are free. Go Pro for unlimited exports, all drinks, and no watermark.
          </p>
          <button
            onClick={async () => {
              const res = await fetch("/api/polar/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: "monthly" }),
              });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            }}
            style={{
              fontFamily: "'Rowdies', cursive",
              fontSize: "0.9rem",
              color: "var(--ink)",
              background: "var(--pink)",
              border: "2px solid var(--ink)",
              padding: "12px 36px",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Get Pro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 36px" }}>
      <h1
        style={{
          fontFamily: "'Kanit', sans-serif",
          fontWeight: 700,
          fontSize: "2.125rem",
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Pick your drink</label>
              <button
                onClick={() => setShowDrinkModal(true)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Oxygen', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--pink)",
                  padding: 0,
                  textDecoration: "underline",
                  textUnderlineOffset: "2px",
                }}
              >
                View all
              </button>
            </div>
            <div style={{ position: "relative" }}>
              {/* Left arrow */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollDrinks("left")}
                  style={{
                    position: "absolute",
                    left: "-6px",
                    top: "50%",
                    transform: "translateY(calc(-50% - 3px))",
                    zIndex: 5,
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "var(--pink)",
                    border: "1.5px solid var(--ink)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,.12)",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M8 1.5L3 6L8 10.5" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              <div
                ref={drinkScrollRef}
                onScroll={updateScrollArrows}
                className="drink-scroll-row"
                style={{
                  display: "flex",
                  gap: "6px",
                  overflowX: "auto",
                  paddingBottom: "6px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "var(--pink) rgba(0,0,0,.04)",
                  maxWidth: "354px",
                }}
              >
                {(() => {
                  // Always show FREE_DRINKS first, then remaining ALL_DRINKS — never rearrange
                  const mainIds = FREE_DRINKS.map((d) => d.id);
                  const otherDrinks = ALL_DRINKS.filter((d) => !mainIds.includes(d.id));
                  const allRow = [...FREE_DRINKS, ...otherDrinks];

                  return allRow.map((drink) => {
                    const isSelected = selectedDrink === drink.id;
                    const isFree = FREE_IDS.includes(drink.id);
                    const isLocked = !isPro && !isFree && !(extraDrink && drink.id === extraDrink.id);
                    return (
                      <button
                        key={drink.id}
                        onClick={() => {
                          if (isLocked) {
                            setShowLockedMsg(true);
                            setTimeout(() => setShowLockedMsg(false), 3000);
                            return;
                          }
                          setSelectedDrink(drink.id);
                          if (!FREE_IDS.includes(drink.id)) setExtraDrink(drink);
                        }}
                        style={{
                          background: isSelected ? "var(--pink)" : isLocked ? "rgba(0,0,0,.03)" : "var(--w)",
                          border: "2px solid",
                          borderColor: isSelected ? "var(--ink)" : "rgba(0,0,0,.06)",
                          borderRadius: "10px",
                          padding: "6px 2px 4px",
                          cursor: isLocked ? "not-allowed" : "pointer",
                          transition: "all 0.15s",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "2px",
                          minWidth: "66px",
                          flexShrink: 0,
                          opacity: isLocked ? 0.45 : 1,
                          position: "relative",
                        }}
                      >
                        {isLocked && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--im)" stroke="none" style={{ position: "absolute", top: "3px", right: "3px" }}>
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" fill="none" stroke="var(--im)" strokeWidth="2.5" />
                          </svg>
                        )}
                        <img src={`/doodles/${drink.id}.png`} alt={drink.name} style={{ width: "36px", height: "36px", objectFit: "contain", filter: isLocked ? "grayscale(0.5)" : "none" }} />
                        <span style={{
                          fontFamily: "'Oxygen', sans-serif",
                          fontSize: "0.55rem",
                          color: "var(--ink)",
                          fontWeight: isSelected ? 700 : 400,
                          lineHeight: 1.2,
                          textAlign: "center",
                        }}>
                          {drink.name}
                        </span>
                      </button>
                    );
                  });
                })()}
              </div>
              {/* Right arrow */}
              {canScrollRight && (
                <button
                  onClick={() => scrollDrinks("right")}
                  style={{
                    position: "absolute",
                    right: "-6px",
                    top: "50%",
                    transform: "translateY(calc(-50% - 3px))",
                    zIndex: 5,
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "var(--pink)",
                    border: "1.5px solid var(--ink)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,.12)",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M4 1.5L9 6L4 10.5" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>

            {/* Locked drink message */}
            {showLockedMsg && (
              <div style={{
                marginTop: "8px",
                padding: "8px 14px",
                background: "var(--pink)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}>
                <p style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.75rem", color: "var(--ink)", fontWeight: 500 }}>
                  Only available in Pro plan
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => {
                      window.location.href = "/dashboard/pricing";
                    }}
                    style={{
                      fontFamily: "'Rowdies', cursive",
                      fontSize: "0.7rem",
                      color: "var(--w)",
                      background: "var(--ink)",
                      border: "none",
                      padding: "5px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Go Pro
                  </button>
                  <button
                    onClick={() => setShowLockedMsg(false)}
                    style={{
                      fontFamily: "'Oxygen', sans-serif",
                      fontSize: "0.7rem",
                      color: "var(--ink)",
                      background: "transparent",
                      border: "1.5px solid var(--ink)",
                      padding: "5px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Your milestone */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Your milestone</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <MilestoneDropdown value={milestoneType} onChange={setMilestoneType} />

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
                onBlur={(e) => (e.target.style.borderColor = "var(--ink)")}
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
              onBlur={(e) => (e.target.style.borderColor = "var(--ink)")}
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
            {isExporting ? "Toasting..." : "Toast It!"}
          </button>
          {exportLimitHit && (
            <div style={{
              marginTop: "16px",
              padding: "20px 24px",
              background: "var(--bg)",
              border: "2px solid var(--ink)",
              borderRadius: "14px",
              textAlign: "center",
            }}>
              <p style={{
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--ink)",
                marginBottom: "6px",
              }}>
                Free plan export limit reached
              </p>
              <p style={{
                fontFamily: "'Oxygen', sans-serif",
                fontSize: "0.8rem",
                color: "var(--im)",
                marginBottom: "14px",
              }}>
                First 5 card exports are free. Upgrade for unlimited exports.
              </p>
              <button
                onClick={() => {
                  window.location.href = "/dashboard/pricing";
                }}
                style={{
                  fontFamily: "'Rowdies', cursive",
                  fontSize: "0.85rem",
                  color: "var(--ink)",
                  background: "var(--pink)",
                  border: "2px solid var(--ink)",
                  padding: "10px 28px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Get Pro
              </button>
            </div>
          )}

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

      {/* Drink picker modal for Pro */}
      {showDrinkModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,.4)",
            backdropFilter: "blur(4px)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowDrinkModal(false)}
        >
          <div
            className="drink-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--w)",
              borderRadius: "16px",
              border: "2px solid var(--ink)",
              maxWidth: "774px",
              width: "100%",
              maxHeight: "493px",
              display: "flex",
              flexDirection: "column",
              animation: "slideIn 0.2s ease",
              overflow: "hidden",
            }}
          >
            {/* Sticky header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 32px 14px",
              background: "var(--w)",
              borderBottom: "1px solid rgba(0,0,0,.06)",
              flexShrink: 0,
            }}>
              <h2 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--ink)" }}>
                All Drinks
              </h2>
              <button
                onClick={() => setShowDrinkModal(false)}
                style={{
                  background: "var(--pink)",
                  border: "2px solid var(--ink)",
                  cursor: "pointer",
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--w)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>

            {/* Scrollable content */}
            <div style={{
              overflowY: "auto",
              overscrollBehavior: "contain",
              padding: "16px 32px 24px",
              flex: 1,
            }}>

            {/* Favorites section at top */}
            {favorites.length > 0 && (
              <div style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid rgba(0,0,0,.08)" }}>
                <p style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 600, fontSize: "0.7rem", color: "var(--pink)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--pink)" stroke="var(--pink)" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                  Favorites
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {favorites.map((fId) => {
                    const drink = ALL_DRINKS.find((d) => d.id === fId);
                    if (!drink) return null;
                    const isSelected = selectedDrink === drink.id;
                    return (
                      <button
                        key={drink.id}
                        onClick={() => {
                          setSelectedDrink(drink.id);
                          if (!FREE_IDS.includes(drink.id)) setExtraDrink(drink);
                          setShowDrinkModal(false);
                        }}
                        style={{
                          background: isSelected ? "var(--pink)" : "var(--bg)",
                          border: "1.5px solid",
                          borderColor: isSelected ? "var(--ink)" : "rgba(0,0,0,.08)",
                          borderRadius: "8px",
                          padding: "5px 10px",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <img src={`/doodles/${drink.id}.png`} alt={drink.name} style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                        <span style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.7rem", color: "var(--ink)", fontWeight: isSelected ? 700 : 500 }}>
                          {drink.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Categorized drinks — category title then chips below */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {DRINK_CATEGORIES.map((cat) => (
              <div key={cat.group}>
                <p style={{
                  fontFamily: "'Kanit', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  color: "var(--im)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "6px",
                }}>
                  {cat.group}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {cat.drinks.map((drink) => {
                    const isSelected = selectedDrink === drink.id;
                    const isFav = favorites.includes(drink.id);
                    const isFree = FREE_IDS.includes(drink.id);
                    const isModalLocked = !isPro && !isFree;
                    return (
                      <button
                        key={drink.id}
                        onClick={() => {
                          if (isModalLocked) {
                            setShowDrinkModal(false);
                            setShowLockedMsg(true);
                            setTimeout(() => setShowLockedMsg(false), 3000);
                            return;
                          }
                          setSelectedDrink(drink.id);
                          if (!isFree) setExtraDrink(drink);
                          setShowDrinkModal(false);
                        }}
                        style={{
                          background: isSelected ? "var(--pink)" : isModalLocked ? "rgba(0,0,0,.03)" : "var(--bg)",
                          border: "1.5px solid",
                          borderColor: isSelected ? "var(--ink)" : "rgba(0,0,0,.08)",
                          borderRadius: "8px",
                          padding: "8px",
                          cursor: isModalLocked ? "not-allowed" : "pointer",
                          transition: "all 0.15s",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                          width: "70px",
                          position: "relative",
                          opacity: isModalLocked ? 0.45 : 1,
                        }}
                      >
                        {/* Lock icon for non-pro */}
                        {isModalLocked && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--im)" stroke="none" style={{ position: "absolute", top: "4px", right: "4px" }}>
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" fill="none" stroke="var(--im)" strokeWidth="2.5" />
                          </svg>
                        )}
                        {/* Heart icon — only for pro */}
                        {!isModalLocked && (
                          <div
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(drink.id); }}
                            style={{ position: "absolute", top: "4px", right: "4px", cursor: "pointer", display: "flex" }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill={isFav ? "var(--pink)" : "none"} stroke={isFav ? "var(--pink)" : "rgba(0,0,0,.2)"} strokeWidth="2">
                              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                            </svg>
                          </div>
                        )}
                        <img src={`/doodles/${drink.id}.png`} alt={drink.name} style={{ width: "32px", height: "32px", objectFit: "contain", filter: isModalLocked ? "grayscale(0.5)" : "none" }} />
                        <span style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.6rem", color: "var(--ink)", fontWeight: isSelected ? 700 : 400, textAlign: "center", lineHeight: 1.1 }}>
                          {drink.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            </div>
            </div>{/* end scrollable content */}
          </div>
        </div>
      )}

      {/* Toast notification after download */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            background: "var(--w)",
            border: "2px solid var(--ink)",
            padding: "24px 28px",
            borderRadius: "16px",
            boxShadow: "0 12px 32px rgba(0,0,0,.12)",
            zIndex: 100,
            width: "420px",
            animation: "slideIn 0.3s ease",
          }}
        >
          <button
            onClick={() => { setShowToast(false); setToastyDancing(false); }}
            style={{
              position: "absolute",
              top: "12px",
              right: "14px",
              background: "var(--pink)",
              border: "2px solid var(--ink)",
              borderRadius: "8px",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--w)",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            &times;
          </button>
          <p style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--ink)", marginBottom: "6px" }}>
            Card downloaded!
          </p>
          <p style={{ fontFamily: "'Oxygen', sans-serif", fontSize: "0.85rem", color: "var(--im)", lineHeight: 1.5, marginBottom: "16px" }}>
            Tag <strong style={{ color: "var(--ink)" }}>@sushbuilds</strong> on X to get a repost and be featured on the Toasters Wall!
          </p>
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(`Just hit ${milestoneNumber} ${milestoneType}! 🎉\n\nMade my celebration card on ToastIT ✨\n\n@sushbuilds`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'Rowdies', cursive",
              fontSize: "0.85rem",
              color: "var(--ink)",
              background: "var(--pink)",
              border: "2px solid var(--ink)",
              padding: "10px 24px",
              borderRadius: "10px",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--ink)">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>
        </div>
      )}

      {/* Confetti on download */}
      {toastyDancing && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 199, overflow: "hidden" }}>
          {Array.from({ length: 40 }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 0.8;
            const duration = 1.5 + Math.random() * 1.5;
            const size = 6 + Math.random() * 8;
            const colors = ["var(--pink)", "#FFD700", "var(--ink)", "#e0879a", "#FFF3CD", "#FF6B6B", "#4ECDC4"];
            const color = colors[i % colors.length];
            const rotation = Math.random() * 360;
            const drift = (Math.random() - 0.5) * 80;
            const shape = i % 3; // 0=square, 1=circle, 2=rectangle
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: `${left}%`,
                  width: shape === 2 ? `${size * 0.5}px` : `${size}px`,
                  height: shape === 2 ? `${size * 1.5}px` : `${size}px`,
                  background: color,
                  borderRadius: shape === 1 ? "50%" : "1px",
                  transform: `rotate(${rotation}deg)`,
                  animation: `confettiFall ${duration}s ease-in ${delay}s forwards`,
                  ["--drift" as string]: `${drift}px`,
                  opacity: 0,
                }}
              />
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes confettiFall {
          0% { opacity: 1; transform: translateY(0) translateX(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) translateX(var(--drift, 0px)) rotate(720deg); }
        }
        .drink-modal ::-webkit-scrollbar {
          width: 6px;
        }
        .drink-modal ::-webkit-scrollbar-track {
          background: transparent;
        }
        .drink-modal ::-webkit-scrollbar-thumb {
          background: var(--pink);
          border-radius: 3px;
        }
        .drink-modal ::-webkit-scrollbar-thumb:hover {
          background: #e891a0;
        }
        .drink-scroll-row::-webkit-scrollbar {
          height: 4px;
        }
        .drink-scroll-row::-webkit-scrollbar-track {
          background: rgba(0,0,0,.04);
          border-radius: 2px;
        }
        .drink-scroll-row::-webkit-scrollbar-thumb {
          background: var(--pink);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
