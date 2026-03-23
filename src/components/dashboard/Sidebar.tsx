"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Create Card",
    href: "/dashboard/create",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Toasters Wall",
    href: "/dashboard/wall",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "240px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "var(--bg)",
        borderRight: "1.5px solid rgba(0,0,0,.08)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontFamily: "'Kanit', sans-serif",
          fontWeight: 700,
          fontSize: "1.6rem",
          color: "var(--ink)",
          textDecoration: "none",
          padding: "0 20px",
          marginBottom: "24px",
        }}
      >
        ToastIT
      </Link>

      {/* Nav Items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "0 12px", maxWidth: "none", margin: 0, alignItems: "stretch", justifyContent: "flex-start" }}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard/create" && pathname === "/dashboard");

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "10px",
                padding: "10px 16px",
                borderRadius: "10px",
                textDecoration: "none",
                fontFamily: "'Oxygen', sans-serif",
                fontSize: "0.9rem",
                fontWeight: isActive ? 700 : 400,
                color: isActive ? "var(--ink)" : "var(--im)",
                background: isActive ? "var(--pink)" : "transparent",
                transition: "all 0.15s",
                width: "100%",
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.5, display: "flex" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Pro Badge */}
      <div
        style={{
          margin: "0 14px",
          padding: "14px",
          background: "var(--w)",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Kanit', sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "var(--ink)",
            marginBottom: "4px",
          }}
        >
          Free Plan
        </p>
        <p
          style={{
            fontFamily: "'Oxygen', sans-serif",
            fontSize: "0.7rem",
            color: "var(--im)",
            marginBottom: "10px",
            lineHeight: 1.4,
          }}
        >
          Unlock unlimited exports &amp; no watermark
        </p>
        <Link
          href="/dashboard/profile"
          style={{
            fontFamily: "'Rowdies', cursive",
            fontSize: "0.75rem",
            color: "var(--ink)",
            background: "var(--pink)",
            border: "2px solid var(--ink)",
            padding: "6px 18px",
            borderRadius: "8px",
            textDecoration: "none",
            display: "inline-block",
            transition: "all 0.2s",
          }}
        >
          Go Pro
        </Link>
      </div>
    </aside>
  );
}
