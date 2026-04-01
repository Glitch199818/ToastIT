/* eslint-disable @next/next/no-img-element */
"use client";

import { forwardRef, useRef, useEffect, useState } from "react";

// Colors that complement each drink doodle
const DRINK_COLORS: Record<string, string> = {
  champagne: "#FFD6C0",   // warm peach
  cocktail: "#F9D472",    // golden yellow
  cosmo: "#FFD6D6",       // soft rose
  espresso_martini: "#D4C5A9", // warm beige
  iced_coffee: "#F27A9F", // hot pink
  margarita: "#D4F5D0",   // fresh green
  mimosa: "#FFE4C8",      // peach/salmon
  mojito: "#F5E6A3",      // bright yellow
  pina_colada: "#F9D472", // golden
  wine: "#E8D4F0",        // soft lavender
};

// Fixed internal card dimensions — the card always renders at this size
// and gets scaled down proportionally to fit the container
const CARD_WIDTH = 720;
const CARD_HEIGHT = CARD_WIDTH * (2025 / 3600); // ≈ 405

interface CardPreviewProps {
  drink: string | null;
  milestone: string;
  milestoneLabel: string;
  handle: string;
  drinkSize?: number;
  numberSize?: number;
  isPro?: boolean;
}

const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(
  ({ drink, milestone, milestoneLabel, handle, drinkSize = 100, numberSize = 100, isPro = false }, ref) => {
    const bgColor = drink ? DRINK_COLORS[drink] || "#FFB4E4" : "#FFB4E4";
    const displayMilestone = milestone || "100";

    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
      const updateScale = () => {
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          setScale(containerWidth / CARD_WIDTH);
        }
      };

      updateScale();
      const observer = new ResizeObserver(updateScale);
      if (containerRef.current) observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, []);

    // Scale font size based on character count and numberSize slider
    const getBaseFontSize = () => {
      const len = displayMilestone.length;
      if (len <= 2) return 10;
      if (len <= 3) return 8.5;
      if (len <= 4) return 6.5;
      if (len <= 5) return 5;
      return 4;
    };
    const getFontSize = () => `${getBaseFontSize() * (numberSize / 100)}rem`;

    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          aspectRatio: "3600 / 2025",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          ref={ref}
          style={{
            width: `${CARD_WIDTH}px`,
            height: `${CARD_HEIGHT}px`,
            borderRadius: "4px",
            background: bgColor,
            border: "3px solid var(--ink)",
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            overflow: "hidden",
            boxShadow: "4px 4px 0 rgba(0,0,0,.1)",
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
        >
          {/* Drink Doodle */}
          <div
            style={{
              width: "48%",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {drink && (
              <img
                src={`/doodles/${drink}.png`}
                alt={drink}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  height: `${drinkSize}%`,
                  width: `${drinkSize}%`,
                  objectFit: "contain",
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px 20px 20px 0",
            }}
          >
            <div
              style={{
                fontFamily: "'Seaweed Script', cursive",
                fontSize: getFontSize(),
                color: "var(--ink)",
                lineHeight: 0.85,
              }}
            >
              {displayMilestone}
            </div>
            <div
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "1.4rem",
                color: "var(--ink)",
                marginTop: "8px",
              }}
            >
              {milestoneLabel || "Followers"}
            </div>
          </div>

          {/* Handle */}
          <div
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 600,
              fontSize: "0.7rem",
              color: "var(--im)",
              position: "absolute",
              bottom: "10px",
              right: "14px",
            }}
          >
            {handle ? (handle.startsWith("@") ? handle : `@${handle}`) : "@handle"}
          </div>

          {/* Watermark sticker for free users */}
          {!isPro && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "-8px",
                zIndex: 5,
                transform: "rotate(3deg)",
              }}
            >
              <div
                style={{
                  background: "#FFFDF5",
                  border: "2px solid var(--ink)",
                  padding: "5px 14px 5px 12px",
                  fontFamily: "'Seaweed Script', cursive",
                  fontSize: "0.7rem",
                  color: "var(--ink)",
                  whiteSpace: "nowrap",
                  boxShadow: "2px 2px 0 rgba(0,0,0,0.1)",
                  position: "relative",
                }}
              >
                Made with ToastIT
                {/* Tape fold effect on left edge */}
                <div
                  style={{
                    position: "absolute",
                    left: "-6px",
                    top: "50%",
                    transform: "translateY(-50%) rotate(45deg)",
                    width: "10px",
                    height: "10px",
                    background: "#FFFDF5",
                    border: "2px solid var(--ink)",
                    borderRight: "none",
                    borderTop: "none",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

CardPreview.displayName = "CardPreview";

export default CardPreview;
