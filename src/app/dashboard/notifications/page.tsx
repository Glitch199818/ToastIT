"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ToastyStatic } from "@/components/dashboard/Toasty";

interface Notification {
  id: string;
  type: string;
  message: string;
  created_at: string;
  read: boolean;
}

const PLACEHOLDER_NOTIFICATIONS: Notification[] = [
  {
    id: "placeholder-1",
    type: "welcome",
    message: "Welcome to ToastIT! Create your first celebration card and share it on X.",
    created_at: new Date().toISOString(),
    read: false,
  },
  {
    id: "placeholder-2",
    type: "feature",
    message: "New drinks added this week — Espresso Martini and Pina Colada are now available!",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      // Use placeholder if no real notifications
      if (data && data.length > 0) {
        setNotifications(data);
      } else {
        setNotifications(PLACEHOLDER_NOTIFICATIONS);
      }
      setLoading(false);

      // Mark all as read
      if (data && data.some((n) => !n.read)) {
        const unreadIds = data.filter((n) => !n.read).map((n) => n.id);
        await supabase
          .from("notifications")
          .update({ read: true })
          .in("id", unreadIds);
      }
    };
    fetchNotifications();
  }, []);

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
        Notifications
      </h1>

      {loading ? (
        <p style={{ fontFamily: "'Oxygen', sans-serif", color: "var(--im)" }}>
          Loading...
        </p>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: "48px" }}>
          <ToastyStatic mood="sleeping" size={120} speech="Nothing here yet" />
          <p style={{
            fontFamily: "'Oxygen', sans-serif",
            fontSize: "0.85rem",
            color: "var(--im)",
            lineHeight: 1.5,
            maxWidth: "320px",
            margin: "16px auto 0",
          }}>
            Tag <strong style={{ color: "var(--ink)" }}>@sushbuilds</strong> on X after sharing your card to get featured!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={async () => {
                if (!n.read && !n.id.startsWith("placeholder")) {
                  const supabase = createClient();
                  await supabase
                    .from("notifications")
                    .update({ read: true })
                    .eq("id", n.id);
                }
                setNotifications((prev) =>
                  prev.map((notif) =>
                    notif.id === n.id ? { ...notif, read: true } : notif
                  )
                );
              }}
              style={{
                background: n.read ? "var(--w)" : "var(--pink)",
                borderRadius: "12px",
                padding: "16px 20px",
                border: "2px solid var(--ink)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: n.read ? "default" : "pointer",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: n.read ? "transparent" : "var(--ink)",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontFamily: "'Oxygen', sans-serif",
                    fontSize: "0.85rem",
                    color: "var(--ink)",
                    fontWeight: n.read ? 400 : 700,
                  }}
                >
                  {n.message}
                </p>
                <p
                  style={{
                    fontFamily: "'Oxygen', sans-serif",
                    fontSize: "0.7rem",
                    color: "var(--im)",
                    marginTop: "4px",
                  }}
                >
                  {new Date(n.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              {!n.read && (
                <span style={{
                  fontFamily: "'Oxygen', sans-serif",
                  fontSize: "0.65rem",
                  color: "var(--ink)",
                  opacity: 0.5,
                }}>
                  Click to mark read
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
