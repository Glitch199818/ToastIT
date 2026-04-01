/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ToastyStatic } from "@/components/dashboard/Toasty";

interface WallPost {
  id: string;
  handle: string;
  website?: string;
  milestone: string;
  tweetUrl: string;
  image: string;
  date: string;
}

interface Reactions {
  heart: number;
  [key: string]: number;
}

const WALL_POSTS: WallPost[] = [
  {
    id: "sushbuilds-900",
    handle: "sushbuilds",
    website: "https://toastit.app",
    milestone: "900 Followers",
    tweetUrl: "https://x.com/sushbuilds/status/2030705737069175049",
    image: "/screenshots/post-900-cocktail.png",
    date: "Mar 8, 2026",
  },
  {
    id: "sushbuilds-800",
    handle: "sushbuilds",
    website: "https://toastit.app",
    milestone: "800 Followers",
    tweetUrl: "https://x.com/sushbuilds/status/2030339387008102871",
    image: "/screenshots/post-800-mojito.png",
    date: "Feb 28, 2026",
  },
];

const REACTION_TYPES = [
  { type: "heart", label: "Heart" },
] as const;

const getXAvatar = (handle: string) => `https://unavatar.io/x/${handle}`;

const getWeekOf = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
};

export default function WallPage() {
  const [reactions, setReactions] = useState<Record<string, Reactions>>({});
  const [userReactions, setUserReactions] = useState<Record<string, string[]>>({});

  const loadReactions = useCallback(async () => {
    const supabase = createClient();
    const weekOf = getWeekOf();
    const { data } = await supabase
      .from("wall_reactions")
      .select("*")
      .eq("week_of", weekOf);

    if (data) {
      const map: Record<string, Reactions> = {};
      data.forEach((r) => {
        if (!map[r.post_id]) map[r.post_id] = { heart: 0 };
        map[r.post_id][r.reaction_type as keyof Reactions] = r.count;
      });
      setReactions(map);
    }

    // Load user's reactions from localStorage
    const saved = localStorage.getItem("toastit_wall_reactions");
    if (saved) setUserReactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReactions();
  }, [loadReactions]);

  const handleReaction = async (postId: string, reactionType: string) => {
    const userPostReactions = userReactions[postId] || [];
    const alreadyReacted = userPostReactions.includes(reactionType);

    // Toggle: add or remove reaction
    const newUserReactions = {
      ...userReactions,
      [postId]: alreadyReacted
        ? userPostReactions.filter((r) => r !== reactionType)
        : [...userPostReactions, reactionType],
    };
    setUserReactions(newUserReactions);
    localStorage.setItem("toastit_wall_reactions", JSON.stringify(newUserReactions));

    // Optimistic UI update
    setReactions((prev) => {
      const postReactions = prev[postId] || { heart: 0 };
      const currentCount = postReactions[reactionType as keyof Reactions] || 0;
      return {
        ...prev,
        [postId]: {
          ...postReactions,
          [reactionType]: alreadyReacted ? Math.max(0, currentCount - 1) : currentCount + 1,
        },
      };
    });

    // Update Supabase
    const supabase = createClient();
    const weekOf = getWeekOf();

    const { data: existing, error: fetchErr } = await supabase
      .from("wall_reactions")
      .select("id, count")
      .eq("post_id", postId)
      .eq("reaction_type", reactionType)
      .eq("week_of", weekOf)
      .maybeSingle();

    if (fetchErr) console.error("Fetch reaction error:", fetchErr);

    if (existing) {
      const newCount = alreadyReacted ? Math.max(0, existing.count - 1) : existing.count + 1;
      const { error: updateErr } = await supabase
        .from("wall_reactions")
        .update({ count: newCount })
        .eq("id", existing.id);
      if (updateErr) console.error("Update reaction error:", updateErr);
    } else if (!alreadyReacted) {
      const { error: insertErr } = await supabase.from("wall_reactions").insert({
        post_id: postId,
        reaction_type: reactionType,
        count: 1,
        week_of: weekOf,
      });
      if (insertErr) console.error("Insert reaction error:", insertErr);
    }
  };

  const getTotalReactions = (postId: string) => {
    const r = reactions[postId];
    if (!r) return 0;
    return r.heart;
  };

  // Sort posts by total reactions for top 3
  const sortedPosts = [...WALL_POSTS].sort(
    (a, b) => getTotalReactions(b.id) - getTotalReactions(a.id)
  );
  const top3 = sortedPosts.filter((p) => getTotalReactions(p.id) > 0).slice(0, 3);

  return (
    <div style={{ padding: "32px 36px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1
          style={{
            fontFamily: "'Kanit', sans-serif",
            fontWeight: 700,
            fontSize: "2.125rem",
            color: "var(--ink)",
          }}
        >
          Toasters Wall
        </h1>
        <Link
          href="/dashboard/create"
          style={{
            fontFamily: "'Rowdies', cursive",
            fontSize: "0.8rem",
            color: "var(--ink)",
            background: "var(--pink)",
            border: "2px solid var(--ink)",
            padding: "8px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.2s",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create New
        </Link>
      </div>

      <p style={{
        fontFamily: "'Oxygen', sans-serif",
        fontSize: "0.85rem",
        color: "var(--im)",
        marginBottom: "24px",
      }}>
        Milestone celebrations from the community. Tag <strong style={{ color: "var(--ink)" }}>@sushbuilds</strong> on X to get featured!
      </p>

      {/* Empty state */}
      {sortedPosts.length === 0 && (
        <div style={{ textAlign: "center", paddingTop: "48px" }}>
          <ToastyStatic mood="holding-drink" size={120} speech="Be the first to toast!" />
          <p style={{
            fontFamily: "'Oxygen', sans-serif",
            fontSize: "0.85rem",
            color: "var(--im)",
            lineHeight: 1.5,
            maxWidth: "340px",
            margin: "16px auto 0",
          }}>
            A gallery of milestone celebrations from the community. Tag <strong style={{ color: "var(--ink)" }}>@sushbuilds</strong> on X to get featured here!
          </p>
        </div>
      )}

      {/* Post Grid — sorted by reactions */}
      {sortedPosts.length > 0 && <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
      }}>
        {sortedPosts.map((post, idx) => {
          const postReactions = reactions[post.id] || { heart: 0 };
          const userPostReactions = userReactions[post.id] || [];
          const rank = top3.findIndex((p) => p.id === post.id);
          const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

          return (
            <div
              key={post.id}
              style={{
                background: "var(--w)",
                border: "2px solid var(--ink)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "4px 4px 0 rgba(0,0,0,.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Card image — links to tweet */}
              <a
                href={post.tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  borderBottom: "2px solid var(--ink)",
                  display: "block",
                  position: "relative",
                }}
              >
                {/* Rank badge */}
                {rank >= 0 && rank < 3 && (
                  <div style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    background: rankColors[rank],
                    color: rank === 0 ? "var(--ink)" : "var(--w)",
                    fontFamily: "'Kanit', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid var(--ink)",
                    zIndex: 2,
                  }}>
                    #{rank + 1}
                  </div>
                )}
                <img
                  src={post.image}
                  alt={post.milestone}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </a>

              {/* Info */}
              <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <img
                    src={getXAvatar(post.handle)}
                    alt={post.handle}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: "1.5px solid var(--ink)",
                      objectFit: "cover",
                      background: "var(--pink)",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontFamily: "'Oxygen', sans-serif",
                      fontSize: "0.8rem",
                      color: "var(--ink)",
                      fontWeight: 700,
                    }}>
                      @{post.handle}
                    </p>
                    {post.website && (
                      <a
                        href={post.website.startsWith("http") ? post.website : `https://${post.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: "'Oxygen', sans-serif",
                          fontSize: "0.7rem",
                          color: "var(--pink)",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--pink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        {post.website.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>
                  <p style={{
                    fontFamily: "'Oxygen', sans-serif",
                    fontSize: "0.7rem",
                    color: "var(--im)",
                  }}>
                    {post.date}
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{
                    fontFamily: "'Oxygen', sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--pink)",
                  }}>
                    {post.milestone}
                  </p>
                </div>

                {/* Reaction buttons */}
                <div style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "12px",
                  borderTop: "1px solid rgba(0,0,0,.06)",
                  paddingTop: "12px",
                }}>
                  {REACTION_TYPES.map(({ type }) => {
                    const count = postReactions[type as keyof Reactions] || 0;
                    const hasReacted = userPostReactions.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => handleReaction(post.id, type)}
                        disabled={false}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "5px 12px",
                          background: hasReacted ? "var(--pink)" : "var(--w)",
                          border: hasReacted ? "1.5px solid var(--ink)" : "1.5px solid rgba(0,0,0,.1)",
                          borderRadius: "20px",
                          cursor: "pointer",
                          fontFamily: "'Oxygen', sans-serif",
                          fontSize: "0.75rem",
                          color: hasReacted ? "var(--w)" : "var(--ink)",
                          fontWeight: hasReacted ? 700 : 400,
                          transition: "all 0.15s",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={hasReacted ? "var(--w)" : "none"} stroke={hasReacted ? "var(--w)" : "var(--pink)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                        <span>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>}
    </div>
  );
}
