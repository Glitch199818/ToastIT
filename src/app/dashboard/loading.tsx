export default function DashboardLoading() {
  return (
    <div className="dash-page" style={{ padding: "32px 36px" }}>
      {/* Title skeleton */}
      <div
        style={{
          width: "200px",
          height: "36px",
          background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      />
      {/* Content skeleton */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[300, 250, 280].map((w, i) => (
          <div
            key={i}
            style={{
              width: `${w}px`,
              height: "20px",
              background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              borderRadius: "6px",
            }}
          />
        ))}
        {/* Card skeleton */}
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            height: "200px",
            background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            borderRadius: "14px",
            marginTop: "8px",
          }}
        />
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
