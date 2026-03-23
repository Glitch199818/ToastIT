export default function WallPage() {
  return (
    <div style={{ padding: "32px 40px" }}>
      <h1
        style={{
          fontFamily: "'Odor Mean Chey', serif",
          fontWeight: 400,
          fontSize: "1.8rem",
          color: "var(--ink)",
          marginBottom: "16px",
        }}
      >
        Toasters Wall
      </h1>
      <div
        style={{
          background: "var(--w)",
          borderRadius: "20px",
          padding: "48px",
          border: "2px solid rgba(0,0,0,.05)",
          textAlign: "center",
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--il)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginBottom: "16px", opacity: 0.5 }}
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        <p
          style={{
            fontFamily: "'Oxygen', sans-serif",
            fontSize: "1rem",
            color: "var(--im)",
            marginBottom: "8px",
          }}
        >
          A gallery of milestone celebrations from the community.
        </p>
        <p
          style={{
            fontFamily: "'Oxygen', sans-serif",
            fontSize: "0.85rem",
            color: "var(--il)",
          }}
        >
          Coming soon — Pro members get featured here.
        </p>
      </div>
    </div>
  );
}
