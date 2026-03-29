"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Toasty — ToastIT's pixel-art pink cat mascot.
 * Walks left↔right at the bottom of the page.
 * Tail wags periodically. Reacts to drink picks.
 */

export type ToastyMood = "idle" | "cocktail" | "bubbly" | "coffee" | "tropical" | "wine" | "sleeping" | "cool" | "celebrating" | "holding-drink";

const DRINK_TO_MOOD: Record<string, ToastyMood> = {
  cosmo: "cocktail",
  cocktail: "cocktail",
  margarita: "cocktail",
  champagne: "bubbly",
  mimosa: "bubbly",
  iced_coffee: "coffee",
  espresso_martini: "coffee",
  mojito: "tropical",
  pina_colada: "tropical",
  wine: "wine",
};

export function getDrinkMood(drinkId: string | null): ToastyMood {
  if (!drinkId) return "idle";
  return DRINK_TO_MOOD[drinkId] || "idle";
}

/* ---- Static Toasty (for empty states, non-walking) ---- */
export function ToastyStatic({
  mood = "idle",
  size = 100,
  speech,
}: {
  mood?: ToastyMood;
  size?: number;
  speech?: string;
}) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      {speech && <SpeechBubble text={speech} size={size} />}
      <div style={{ position: "relative" }} className={getMoodAnimClass(mood)}>
        <ToastySVG mood={mood} size={size} tailUp={false} walkFrame={0} />
        {/* Animated zzz for sleeping */}
        {mood === "sleeping" && (
          <div style={{
            position: "absolute",
            top: "-4px",
            right: "-8px",
            fontFamily: "'Kanit', sans-serif",
            fontWeight: 700,
            color: "var(--im)",
            fontSize: `${size * 0.14}px`,
            lineHeight: 1,
          }}>
            <span className="toasty-zzz-1" style={{ position: "absolute", right: 0, top: 0 }}>z</span>
            <span className="toasty-zzz-2" style={{ position: "absolute", right: "-8px", top: "-10px" }}>z</span>
            <span className="toasty-zzz-3" style={{ position: "absolute", right: "-14px", top: "-20px" }}>z</span>
          </div>
        )}
      </div>
      <ToastyStyles />
    </div>
  );
}

/* ---- Toasty Idle animation (frame-by-frame) ---- */
const IDLE_FRAMES = Array.from({ length: 8 }, (_, i) =>
  `/toasty_idle/${String(i + 1).padStart(2, "0")}.png`
);

export function ToastyIdle({ size = 100 }: { size?: number }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % IDLE_FRAMES.length);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const aspectRatio = 1680 / 1376;
  return (
    <div style={{ width: size, height: size * aspectRatio, position: "relative" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IDLE_FRAMES[frame]}
        alt=""
        width={size}
        height={size * aspectRatio}
        style={{
          imageRendering: "pixelated",
          display: "block",
          transform: "scaleX(-1)",
        }}
      />
    </div>
  );
}

/* ---- Toasty Drinks animation (frame-by-frame) ---- */
const DRINK_FRAMES = Array.from({ length: 5 }, (_, i) =>
  `/toasty_drinks/${String(i + 1).padStart(2, "0")}.png`
);

export function ToastyDrinks({ size = 100 }: { size?: number }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % DRINK_FRAMES.length);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const aspectRatio = 1680 / 1376;
  return (
    <div style={{ width: size, height: size * aspectRatio, position: "relative" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={DRINK_FRAMES[frame]}
        alt=""
        width={size}
        height={size * aspectRatio}
        style={{
          imageRendering: "pixelated",
          display: "block",
          transform: "scaleX(-1)",
        }}
      />
    </div>
  );
}

/* ---- Walking Toasty (for bottom of page) ---- */
export default function Toasty({
  mood = "idle",
  size = 120,
  speech,
}: {
  mood?: ToastyMood;
  size?: number;
  speech?: string;
}) {
  const [x, setX] = useState(100);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = right, -1 = left
  const [walkFrame, setWalkFrame] = useState(0);
  const [tailUp, setTailUp] = useState(false);
  const [paused, setPaused] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const prevMood = useRef(mood);
  const containerRef = useRef<HTMLDivElement>(null);
  const STEP_SIZE = 4; // bigger, visible steps
  const WALK_INTERVAL = 80; // slower tick for deliberate steps

  // Pause and react when mood changes (drink picked)
  useEffect(() => {
    if (mood !== prevMood.current && mood !== "idle") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPaused(true);
      const timer = setTimeout(() => setPaused(false), 2500);
      prevMood.current = mood;
      return () => clearTimeout(timer);
    }
    prevMood.current = mood;
  }, [mood]);

  // Walking loop — bigger visible steps, constrained to content area
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setX((prev) => {
        const container = containerRef.current?.parentElement;
        const maxX = container ? container.clientWidth - size - 20 : 600;
        const next = prev + direction * STEP_SIZE;
        if (next >= maxX) {
          setDirection(-1);
          return maxX;
        }
        if (next <= 20) {
          setDirection(1);
          return 20;
        }
        return next;
      });
      setWalkFrame((f) => (f + 1) % 2);
    }, WALK_INTERVAL);
    return () => clearInterval(interval);
  }, [direction, paused, size, STEP_SIZE, WALK_INTERVAL]);

  // Tail wag every 3-6 seconds
  useEffect(() => {
    const wag = () => {
      setTailUp(true);
      setTimeout(() => setTailUp(false), 400);
      setTimeout(() => {
        setTailUp(true);
        setTimeout(() => setTailUp(false), 400);
      }, 600);
    };
    const interval = setInterval(wag, 3000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  // Blink every 4-7 seconds
  useEffect(() => {
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 200);
    };
    const interval = setInterval(blink, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  // Random pause to look around
  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      timeout = setTimeout(() => {
        if (cancelled) return;

        if (!paused) {
          setPaused(true);
          setTimeout(() => {
            if (cancelled) return;
            setPaused(false);
            tick();
          }, 1500 + Math.random() * 1000);
        } else {
          tick();
        }
      }, 8000 + Math.random() * 6000);
    };

    tick();
    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [paused]);

  const reactionClass = paused && mood !== "idle" ? getMoodAnimClass(mood) : "";

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        bottom: "0px",
        left: "240px",
        right: 0,
        height: `${size + 50}px`,
        pointerEvents: "none",
        zIndex: 50,
        overflow: "visible",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "8px",
          left: `${x}px`,
          transform: `scaleX(${direction})`,
          transition: "transform 0.2s ease",
          pointerEvents: "auto",
          cursor: "pointer",
        }}
      >
        {/* Speech bubble */}
        {speech && paused && mood !== "idle" && (
          <div style={{
            position: "absolute",
            bottom: `${size + 4}px`,
            left: "50%",
            transform: `scaleX(${direction})`,
            transformOrigin: "center",
            whiteSpace: "nowrap",
          }}>
            <SpeechBubble text={speech} size={size} />
          </div>
        )}
        <div className={reactionClass}>
          <ToastySVG
            mood={paused && mood !== "idle" ? mood : "idle"}
            size={size}
            tailUp={tailUp}
            walkFrame={paused ? 0 : walkFrame}
            blinking={blinking}
          />
        </div>
      </div>
      <ToastyStyles />
    </div>
  );
}

/* ---- Speech Bubble ---- */
function SpeechBubble({ text, size }: { text: string; size: number }) {
  return (
    <div style={{
      background: "var(--w)",
      border: "1.5px solid var(--ink)",
      borderRadius: "10px",
      padding: "5px 12px",
      fontFamily: "'Oxygen', sans-serif",
      fontSize: `${Math.max(Math.min(size * 0.1, 14), 11)}px`,
      color: "var(--ink)",
      textAlign: "center",
      lineHeight: 1.4,
      position: "relative",
      display: "inline-block",
    }}>
      {text}
      <div style={{
        position: "absolute",
        bottom: "-6px",
        left: "50%",
        transform: "translateX(-50%)",
        width: 0, height: 0,
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderTop: "5px solid var(--ink)",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-4px",
        left: "50%",
        transform: "translateX(-50%)",
        width: 0, height: 0,
        borderLeft: "4px solid transparent",
        borderRight: "4px solid transparent",
        borderTop: "4px solid var(--w)",
      }} />
    </div>
  );
}

/* ---- Sprite-animated Body (individual frames) ---- */
const WALK_FRAMES = [
  "/idle_01.png",
  "/idle_02.png",
  "/idle_03.png",
  "/idle_04.png",
  "/idle_05.png",
  "/idle_06.png",
  "/idle_07.png",
  "/idle_08.png",
];

function ToastySVG({
  size,
}: {
  mood: ToastyMood;
  size: number;
  tailUp: boolean;
  walkFrame: number;
  blinking?: boolean;
}) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % WALK_FRAMES.length);
    }, 100); // ~10 fps
    return () => clearInterval(interval);
  }, []);

  // Original frames are 1696×1828, aspect ratio ≈ 0.928
  const displayH = size;
  const displayW = size * (1696 / 1828);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={WALK_FRAMES[frame]}
      alt="Toasty"
      width={displayW}
      height={displayH}
      style={{
        imageRendering: "pixelated",
        display: "block",
        transform: "scaleX(-1)",
      }}
    />
  );
}

function getMoodAnimClass(mood: ToastyMood): string {
  switch (mood) {
    case "cocktail": return "toasty-wobble";
    case "bubbly": return "toasty-bounce";
    case "coffee": return "toasty-jitter";
    case "tropical": return "toasty-sway";
    case "wine": return "toasty-lean";
    case "sleeping": return ""; // no body animation, zzz is animated separately
    case "celebrating": return "toasty-celebrate";
    case "holding-drink": return "";
    default: return "";
  }
}

function ToastyStyles() {
  return (
    <style>{`
      @keyframes toastyWobble {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-6deg); }
        75% { transform: rotate(6deg); }
      }
      @keyframes toastyBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      @keyframes toastyJitter {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        50% { transform: translateX(2px); }
        75% { transform: translateX(-1px); }
      }
      @keyframes toastySway {
        0%, 100% { transform: rotate(0deg) translateY(0); }
        50% { transform: rotate(4deg) translateY(-2px); }
      }
      @keyframes toastyLean {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-10deg); }
      }
      @keyframes toastyBreathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.04); }
      }
      @keyframes toastyCelebrate {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(-5deg); }
        50% { transform: translateY(-3px) rotate(0deg); }
        75% { transform: translateY(-12px) rotate(5deg); }
      }
      @keyframes toastyZzz {
        0% { opacity: 0; transform: translateY(0) scale(0.7); }
        30% { opacity: 1; transform: translateY(-4px) scale(1); }
        80% { opacity: 0.5; transform: translateY(-10px) scale(1.1); }
        100% { opacity: 0; transform: translateY(-14px) scale(0.8); }
      }
      .toasty-zzz-1 { animation: toastyZzz 2.5s ease-in-out infinite; }
      .toasty-zzz-2 { animation: toastyZzz 2.5s ease-in-out 0.5s infinite; }
      .toasty-zzz-3 { animation: toastyZzz 2.5s ease-in-out 1s infinite; }
      .toasty-wobble { animation: toastyWobble 0.8s ease-in-out infinite; }
      .toasty-bounce { animation: toastyBounce 0.5s ease-in-out infinite; }
      .toasty-jitter { animation: toastyJitter 0.12s ease-in-out infinite; }
      .toasty-sway { animation: toastySway 2s ease-in-out infinite; }
      .toasty-lean { animation: toastyLean 3s ease-in-out infinite; }
      .toasty-breathe { animation: toastyBreathe 3s ease-in-out infinite; }
      .toasty-celebrate { animation: toastyCelebrate 0.5s ease-in-out infinite; }
    `}</style>
  );
}
