"use client";

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";

/**
 * InteractiveToasty — wraps any Toasty animation with:
 * 1. Drag-and-drop: pick Toasty up and place him anywhere on screen
 * 2. Pet: click to make hearts float up; rapid clicks trigger a swat reaction
 */

interface InteractiveToastyProps {
  children: ReactNode;
  /** Initial bottom offset in px */
  initialBottom?: number;
  /** Initial right offset in px */
  initialRight?: number;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

export default function InteractiveToasty({
  children,
  initialBottom = 20,
  initialRight = 30,
}: InteractiveToastyProps) {
  // Position state (using bottom/right initially, switch to top/left when dragging)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [swatting, setSwatting] = useState(false);
  const [plop, setPlop] = useState(false);
  const [purring, setPurring] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartId = useRef(0);
  const purrTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize position on mount
  useEffect(() => {
    if (!pos) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPos({
        x: window.innerWidth - initialRight - 80,
        y: window.innerHeight - initialBottom - 100,
      });
    }
  }, []);

  // Keep Toasty on-screen on resize (and clamp saved/loaded positions)
  useEffect(() => {
    if (!pos) return;
    const clamp = () => {
      const el = containerRef.current;
      const w = el?.offsetWidth ?? 80;
      const h = el?.offsetHeight ?? 100;
      const maxX = Math.max(0, window.innerWidth - w);
      const maxY = Math.max(0, window.innerHeight - h);
      setPos((prev) => {
        if (!prev) return prev;
        const x = Math.min(Math.max(0, prev.x), maxX);
        const y = Math.min(Math.max(0, prev.y), maxY);
        if (x === prev.x && y === prev.y) return prev;
        return { x, y };
      });
    };
    clamp();
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, [pos]);

  // --- Drag handlers ---
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setDragging(true);
    setPlop(false);
    setPurring(false);
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return;
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    },
    [dragging]
  );

  const onMouseUp = useCallback(() => {
    if (dragging) {
      setDragging(false);
      // Plop animation on drop
      setPlop(true);
      setTimeout(() => setPlop(false), 300);
    }
  }, [dragging]);

  // Touch support
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
    setDragging(true);
    setPlop(false);
  }, []);

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!dragging) return;
      const touch = e.touches[0];
      setPos({
        x: touch.clientX - dragOffset.current.x,
        y: touch.clientY - dragOffset.current.y,
      });
    },
    [dragging]
  );

  const onTouchEnd = useCallback(() => {
    if (dragging) {
      setDragging(false);
      setPlop(true);
      setTimeout(() => setPlop(false), 300);
    }
  }, [dragging]);

  // Attach global mouse/touch listeners when dragging
  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", onTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [dragging, onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  // --- Pet / Click handler ---
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Don't trigger pet if we just finished dragging
    if (dragging) return;

    clickCount.current += 1;

    // Spawn a heart at click position relative to container
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const id = ++heartId.current;
      const heartX = e.clientX - rect.left - 8 + (Math.random() - 0.5) * 20;
      const heartY = e.clientY - rect.top - 8;
      setHearts((prev) => [...prev, { id, x: heartX, y: heartY }]);
      // Remove heart after animation
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, 1000);
    }

    // Rapid click detection (5 clicks in 1.5s = swat)
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 1500);

    if (clickCount.current >= 5) {
      clickCount.current = 0;
      setSwatting(true);
      setTimeout(() => setSwatting(false), 600);
    }
  }, [dragging]);

  const spawnHeart = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const id = ++heartId.current;
    const heartX = clientX - rect.left - 8 + (Math.random() - 0.5) * 18;
    const heartY = clientY - rect.top - 14 + (Math.random() - 0.5) * 10;
    setHearts((prev) => [...prev, { id, x: heartX, y: heartY }]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1000);
  }, []);

  const startPurr = useCallback(() => {
    if (purrTimer.current) return;
    setPurring(true);
    // Spawn a heart every so often while hovering, like a purr
    purrTimer.current = setInterval(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      spawnHeart(rect.left + rect.width * 0.55, rect.top + rect.height * 0.25);
    }, 650);
  }, [spawnHeart]);

  const stopPurr = useCallback(() => {
    setPurring(false);
    if (purrTimer.current) {
      clearInterval(purrTimer.current);
      purrTimer.current = null;
    }
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
      if (purrTimer.current) clearInterval(purrTimer.current);
    };
  }, []);

  if (!pos) return null;

  return (
    <>
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={handleClick}
        onMouseEnter={() => {
          if (!dragging) startPurr();
        }}
        onMouseLeave={() => {
          stopPurr();
        }}
        style={{
          position: "fixed",
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          zIndex: 9999,
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
          WebkitUserSelect: "none",
          transition: dragging ? "none" : "transform 0.3s ease",
          transform: dragging
            ? "scale(1.1)"
            : plop
            ? "scale(0.85)"
            : swatting
            ? "rotate(-15deg)"
            : purring
            ? "scale(1.03)"
            : "scale(1)",
          filter: dragging ? "drop-shadow(0 8px 16px rgba(0,0,0,0.2))" : "none",
        }}
      >
        {children}

        {/* Floating hearts */}
        {hearts.map((h) => (
          <span
            key={h.id}
            className="toasty-heart-float"
            style={{
              position: "absolute",
              left: `${h.x}px`,
              top: `${h.y}px`,
              fontSize: "18px",
              pointerEvents: "none",
              zIndex: 10000,
            }}
          >
            &#x2764;
          </span>
        ))}

        {/* Swat speech bubble */}
        {swatting && (
          <div
            style={{
              position: "absolute",
              top: "-40px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--w)",
              border: "2px solid var(--ink)",
              borderRadius: "10px",
              padding: "4px 12px",
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 700,
              fontSize: "0.75rem",
              color: "var(--pink)",
              whiteSpace: "nowrap",
              boxShadow: "2px 2px 0 var(--ink)",
              animation: "toastyBubbleIn 0.2s ease",
            }}
          >
            Hey! Stop that!
          </div>
        )}
      </div>

      <style>{`
        @keyframes toastyHeartFloat {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-30px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(0.8);
          }
        }
        .toasty-heart-float {
          animation: toastyHeartFloat 1s ease-out forwards;
          color: var(--pink);
        }
        @keyframes toastyPurrWiggle {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-1px); }
          50% { transform: translateX(1px); }
          75% { transform: translateX(-0.5px); }
        }
        @keyframes toastyBubbleIn {
          0% { opacity: 0; transform: translateX(-50%) translateY(8px) scale(0.9); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
