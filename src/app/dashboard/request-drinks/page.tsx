"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { ToastyDrinks } from "@/components/dashboard/Toasty";

interface DrinkRequest {
  id: string;
  name: string;
  suggested_by: string;
  suggested_by_handle: string;
  suggested_by_avatar: string | null;
  votes: number;
  voters: string[];
  status: string;
  created_at: string;
  week_of: string;
}

export default function RequestDrinksPage() {
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [requests, setRequests] = useState<DrinkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [drinkName, setDrinkName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userHandle, setUserHandle] = useState("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [hasSubmittedThisWeek, setHasSubmittedThisWeek] = useState(false);
  const [toastyMood, setToastyMood] = useState<"idle" | "celebrating" | "cool" | "cocktail">("idle");
  const [toastySpeech, setToastySpeech] = useState("");
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef(Date.now());

  const DRINK_SUGGESTIONS = [
    "How about a Matcha Latte?",
    "Ever tried an Aperol Spritz?",
    "A Paloma would be nice!",
    "What about a Dirty Chai?",
    "Espresso Tonic, anyone?",
    "Lavender Lemonade vibes!",
    "Negroni Sbagliato maybe?",
    "Hot Toddy for cozy days!",
    "Try suggesting a Mango Lassi!",
    "Oat Milk Cortado sounds good...",
  ];

  // Reset idle timer on any activity
  const resetIdleTimer = () => {
    lastActivityRef.current = Date.now();
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      const suggestion = DRINK_SUGGESTIONS[Math.floor(Math.random() * DRINK_SUGGESTIONS.length)];
      setToastyMood("idle");
      setToastySpeech(suggestion);
      // Clear speech after 6 seconds
      setTimeout(() => setToastySpeech(""), 6000);
    }, 12000); // 12 seconds idle
  };

  // Start idle timer on mount
  useEffect(() => {
    resetIdleTimer();
    // Also listen for any interaction
    const handler = () => resetIdleTimer();
    window.addEventListener("mousemove", handler);
    window.addEventListener("keydown", handler);
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("keydown", handler);
    };
  }, []);

  // Toasty reacts to submit
  const triggerSubmitReaction = () => {
    resetIdleTimer();
    setToastyMood("celebrating");
    setToastySpeech("Nice pick!");
    setTimeout(() => {
      setToastyMood("idle");
      setToastySpeech("");
    }, 3000);
  };

  // Toasty reacts to vote
  const triggerVoteReaction = (voted: boolean) => {
    resetIdleTimer();
    setToastyMood("cool");
    setToastySpeech(voted ? "Good taste!" : "Changed your mind?");
    setTimeout(() => {
      setToastyMood("idle");
      setToastySpeech("");
    }, 2500);
  };

  const getWeekOf = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().split("T")[0];
  };

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Check pro status
      try {
        const res = await fetch("/api/polar/status");
        const data = await res.json();
        setIsPro(data.isPro ?? false);
      } catch {
        setIsPro(false);
      }

      if (user) {
        setUserId(user.id);
        setUserHandle(
          user.user_metadata?.user_name ||
            user.user_metadata?.preferred_username ||
            user.email?.split("@")[0] ||
            "anon"
        );
        const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
        setUserAvatar(avatarUrl);
        if (avatarUrl) {
          // Backfill avatar on existing rows
          await supabase
            .from("drink_requests")
            .update({ suggested_by_avatar: avatarUrl })
            .eq("suggested_by", user.id);
        }
      }

      const { data } = await supabase
        .from("drink_requests")
        .select("*")
        .order("votes", { ascending: false });

      if (data) {
        setRequests(data);
        const weekOf = getWeekOf();
        const userSubmission = data.find(
          (r) => r.suggested_by === user?.id && r.week_of === weekOf
        );
        if (userSubmission) setHasSubmittedThisWeek(true);
      }
      setLoading(false);
    }
    load();
  }, [submitted]);

  const handleSubmit = async () => {
    if (!drinkName.trim() || !userId || hasSubmittedThisWeek) return;

    // Check for duplicate drink name (case-insensitive)
    const duplicateExists = requests.some(
      (r) => r.name.toLowerCase().trim() === drinkName.toLowerCase().trim()
    );
    if (duplicateExists) {
      setDuplicateWarning(true);
      setTimeout(() => setDuplicateWarning(false), 3000);
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const weekOf = getWeekOf();

      await supabase.from("drink_requests").insert({
        name: drinkName.trim(),
        suggested_by: userId,
        suggested_by_handle: userHandle,
        suggested_by_avatar: userAvatar,
        votes: 1,
        voters: [userId],
        week_of: weekOf,
      });

      setDrinkName("");
      setSubmitted((s) => !s);
      setHasSubmittedThisWeek(true);
      triggerSubmitReaction();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (request: DrinkRequest) => {
    if (!userId) return;
    const alreadyVoted = request.voters?.includes(userId);
    setVotingId(request.id);

    try {
      const supabase = createClient();

      if (alreadyVoted) {
        await supabase
          .from("drink_requests")
          .update({
            votes: request.votes - 1,
            voters: request.voters.filter((v) => v !== userId),
          })
          .eq("id", request.id);
      } else {
        await supabase
          .from("drink_requests")
          .update({
            votes: request.votes + 1,
            voters: [...(request.voters || []), userId],
          })
          .eq("id", request.id);
      }

      setRequests((prev) =>
        prev
          .map((r) => {
            if (r.id !== request.id) return r;
            return alreadyVoted
              ? { ...r, votes: r.votes - 1, voters: r.voters.filter((v) => v !== userId) }
              : { ...r, votes: r.votes + 1, voters: [...(r.voters || []), userId] };
          })
          .sort((a, b) => b.votes - a.votes)
      );
      triggerVoteReaction(!alreadyVoted);
    } catch (err) {
      console.error(err);
    } finally {
      setVotingId(null);
    }
  };

  const winners = requests.filter((r) => r.status === "winner");
  const activeRequests = requests.filter((r) => r.status === "voting");
  const addedDrinks = requests.filter((r) => r.status === "added");

  return (
    <div style={{ padding: "32px 36px", maxWidth: "780px" }}>
      {/* Header */}
      <h1
        style={{
          fontFamily: "'Kanit', sans-serif",
          fontWeight: 700,
          fontSize: "2.125rem",
          color: "var(--ink)",
          marginBottom: "4px",
        }}
      >
        Drink Requests
      </h1>
      <p
        style={{
          fontFamily: "'Oxygen', sans-serif",
          fontSize: "0.9rem",
          color: "var(--im)",
          marginBottom: "24px",
        }}
      >
        Vote for drinks you want added. Top pick each week wins.
      </p>

      {/* Loading state */}
      {isPro === null && (
        <p style={{ fontFamily: "'Oxygen', sans-serif", color: "var(--im)" }}>Loading...</p>
      )}

      {/* Upgrade gate for free users */}
      {isPro === false && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            paddingTop: "32px",
          }}
        >
          <ToastyDrinks size={120} />
          <p
            style={{
              fontFamily: "'Seaweed Script', cursive",
              fontSize: "2rem",
              color: "var(--ink)",
              marginTop: "16px",
              marginBottom: "12px",
            }}
          >
            Your drink, your rules
          </p>
          <p
            style={{
              fontFamily: "'Oxygen', sans-serif",
              fontSize: "0.9rem",
              color: "var(--im)",
              lineHeight: 1.6,
              maxWidth: "380px",
              marginBottom: "8px",
            }}
          >
            Pro members get to shape the drink menu.
            Suggest new doodles, vote on what gets drawn next,
            and see your pick come to life.
          </p>
          <p
            style={{
              fontFamily: "'Oxygen', sans-serif",
              fontSize: "0.8rem",
              color: "var(--im)",
              marginBottom: "24px",
            }}
          >
            Imagine toasting with a drink <em>you</em> picked.
          </p>
          <a
            href="/dashboard/pricing"
            style={{
              fontFamily: "'Rowdies', cursive",
              fontSize: "0.9rem",
              color: "var(--w)",
              background: "var(--pink)",
              border: "2px solid var(--ink)",
              padding: "12px 28px",
              borderRadius: "10px",
              textDecoration: "none",
              display: "inline-block",
              transition: "all 0.2s",
            }}
          >
            Unlock Drink Requests
          </a>
        </div>
      )}

      {/* Your suggestion card */}
      {isPro !== false && isPro !== null && (<>
      <div
        style={{
          background: "var(--w)",
          border: "2px solid var(--ink)",
          borderRadius: "14px",
          padding: "20px 24px",
          marginBottom: "24px",
        }}
      >
        <p
          style={{
            fontFamily: "'Kanit', sans-serif",
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "var(--ink)",
            marginBottom: "12px",
          }}
        >
          Suggest a drink
        </p>

        {hasSubmittedThisWeek ? (
          <p
            style={{
              fontFamily: "'Oxygen', sans-serif",
              fontSize: "0.9rem",
              color: "var(--im)",
            }}
          >
            Already suggested this week. Vote on others below!
          </p>
        ) : (
          <>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              value={drinkName}
              onChange={(e) => setDrinkName(e.target.value)}
              placeholder="e.g. Matcha Latte, Aperol Spritz..."
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{
                flex: 1,
                padding: "10px 14px",
                fontFamily: "'Oxygen', sans-serif",
                fontSize: "0.9rem",
                border: "2px solid var(--ink)",
                borderRadius: "10px",
                background: "var(--bg)",
                color: "var(--ink)",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--pink)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--ink)")}
            />
            <button
              onClick={handleSubmit}
              disabled={!drinkName.trim() || submitting}
              style={{
                fontFamily: "'Rowdies', cursive",
                fontSize: "0.85rem",
                color: "white",
                background: drinkName.trim() ? "var(--pink)" : "var(--im)",
                border: "2px solid var(--ink)",
                padding: "10px 22px",
                borderRadius: "10px",
                cursor: drinkName.trim() ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                opacity: submitting ? 0.6 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {submitting ? "..." : "Suggest"}
            </button>
          </div>
          {duplicateWarning && (
            <p style={{
              fontFamily: "'Oxygen', sans-serif",
              fontSize: "0.8rem",
              color: "var(--pink)",
              fontWeight: 700,
              marginTop: "8px",
            }}>
              This drink has already been suggested — vote for it instead!
            </p>
          )}
          </>
        )}
      </div>

      {/* Winner Banner */}
      {winners.length > 0 && (
        <div
          style={{
            background: "var(--pink)",
            border: "2px solid var(--ink)",
            borderRadius: "14px",
            padding: "16px 24px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "var(--w)",
              }}
            >
              This week: {winners[0].name}
            </p>
            <p
              style={{
                fontFamily: "'Oxygen', sans-serif",
                fontSize: "0.75rem",
                color: "var(--w)",
                opacity: 0.85,
              }}
            >
              by @{winners[0].suggested_by_handle} &middot; {winners[0].votes} votes
            </p>
          </div>
          <span style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: "2.125rem", color: "var(--w)" }}>
            #1
          </span>
        </div>
      )}

      {/* Voting list */}
      {loading ? (
        <p style={{ fontFamily: "'Oxygen', sans-serif", color: "var(--im)" }}>Loading...</p>
      ) : activeRequests.length === 0 && addedDrinks.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: "40px" }}>
          <p
            style={{
              fontFamily: "'Oxygen', sans-serif",
              fontSize: "0.9rem",
              color: "var(--im)",
            }}
          >
            No suggestions yet. Be the first!
          </p>
        </div>
      ) : (
        <>
          {activeRequests.length > 0 && (
            <div
              style={{
                background: "var(--w)",
                border: "2px solid var(--ink)",
                borderRadius: "14px",
                overflow: "hidden",
                marginBottom: "24px",
              }}
            >
              {/* Table header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 1fr 80px",
                  padding: "12px 20px",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  alignItems: "center",
                }}
              >
                <span style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "var(--im)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  #
                </span>
                <span style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "var(--im)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  DRINK
                </span>
                <span style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "var(--im)", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>
                  VOTES
                </span>
              </div>

              {/* Rows */}
              {activeRequests.map((r, i) => {
                const alreadyVoted = userId ? r.voters?.includes(userId) : false;

                return (
                  <div
                    key={r.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "40px 1fr 80px",
                      padding: "14px 20px",
                      borderBottom: i < activeRequests.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                      alignItems: "center",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Rank */}
                    <span
                      style={{
                        fontFamily: "'Kanit', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        color: "var(--im)",
                      }}
                    >
                      {i + 1}
                    </span>

                    {/* Drink info with avatar */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {r.suggested_by_avatar ? (
                        <img
                          src={r.suggested_by_avatar}
                          alt=""
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            border: "2px solid var(--ink)",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            border: "2px solid var(--ink)",
                            background: "var(--pink)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "var(--w)" }}>
                            {r.suggested_by_handle.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p
                          style={{
                            fontFamily: "'Kanit', sans-serif",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            color: "var(--ink)",
                            lineHeight: 1.2,
                          }}
                        >
                          {r.name}
                        </p>
                        <p
                          style={{
                            fontFamily: "'Oxygen', sans-serif",
                            fontSize: "0.78rem",
                            color: "var(--im)",
                          }}
                        >
                          @{r.suggested_by_handle}
                        </p>
                      </div>
                    </div>

                    {/* Vote button — right side */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                      <span
                        style={{
                          fontFamily: "'Kanit', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          color: alreadyVoted ? "var(--pink)" : "var(--ink)",
                        }}
                      >
                        {r.votes}
                      </span>
                      <button
                        onClick={() => handleVote(r)}
                        disabled={votingId === r.id}
                        style={{
                          background: alreadyVoted ? "var(--pink)" : "none",
                          border: "2px solid",
                          borderColor: alreadyVoted ? "var(--pink)" : "var(--ink)",
                          borderRadius: "8px",
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          opacity: votingId === r.id ? 0.5 : 1,
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (!alreadyVoted) {
                            e.currentTarget.style.background = "var(--bg)";
                          }
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          if (!alreadyVoted) {
                            e.currentTarget.style.background = "none";
                          }
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={alreadyVoted ? "var(--w)" : "var(--ink)"}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 19V5" />
                          <path d="M5 12l7-7 7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Previously added drinks */}
          {addedDrinks.length > 0 && (
            <>
              <p
                style={{
                  fontFamily: "'Kanit', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "var(--im)",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Added to collection
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {addedDrinks.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: "var(--bg)",
                      border: "2px solid var(--ink)",
                      borderRadius: "10px",
                      padding: "8px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Kanit', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        color: "var(--ink)",
                      }}
                    >
                      {r.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Oxygen', sans-serif",
                        fontSize: "0.68rem",
                        color: "var(--im)",
                      }}
                    >
                      by @{r.suggested_by_handle}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
      </>)}

      <style>{`
        @keyframes toastyBubbleIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
