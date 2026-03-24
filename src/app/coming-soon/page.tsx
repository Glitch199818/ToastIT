export default function ComingSoonPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "'Kanit', sans-serif",
          fontWeight: 700,
          fontSize: "2.4rem",
          color: "var(--ink)",
          marginBottom: "8px",
        }}
      >
        ToastIT
      </h1>
      <p
        style={{
          fontFamily: "'Seaweed Script', cursive",
          fontSize: "3.5rem",
          color: "var(--pink)",
          marginBottom: "16px",
          lineHeight: 1.2,
        }}
      >
        Launching Soon
      </p>
      <p
        style={{
          fontFamily: "'Oxygen', sans-serif",
          fontSize: "1.1rem",
          color: "var(--im)",
          maxWidth: "440px",
          lineHeight: 1.6,
          marginBottom: "32px",
        }}
      >
        Turn your X milestones into hand-drawn drink doodle cards that spark conversations.
      </p>
      <a
        href="https://x.com/sushbuilds"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: "'Rowdies', cursive",
          fontSize: "0.9rem",
          color: "var(--ink)",
          background: "var(--pink)",
          border: "2px solid var(--ink)",
          padding: "12px 32px",
          borderRadius: "10px",
          textDecoration: "none",
          transition: "all 0.2s",
        }}
      >
        Follow for updates
      </a>
    </div>
  );
}
