import Link from "next/link";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5E6A3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#FFFDF5",
          borderRadius: "24px",
          padding: "48px 40px",
          maxWidth: "420px",
          width: "100%",
          border: "2px solid rgba(0,0,0,.05)",
          textAlign: "center",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Kanit', sans-serif",
            fontWeight: 700,
            fontSize: "2rem",
            color: "#1A1A1A",
            textDecoration: "none",
            display: "block",
            marginBottom: "8px",
          }}
        >
          ToastIT
        </Link>
        <h1
          style={{
            fontFamily: "'Odor Mean Chey', serif",
            fontWeight: 400,
            fontSize: "1.5rem",
            color: "#1A1A1A",
            marginBottom: "8px",
          }}
        >
          Welcome back
        </h1>
        <p
          style={{
            fontFamily: "'Oxygen', sans-serif",
            fontSize: "0.95rem",
            color: "#4A4A4A",
            marginBottom: "32px",
          }}
        >
          Sign in to toast your milestones
        </p>

        <GoogleSignInButton />

        <p
          style={{
            fontFamily: "'Oxygen', sans-serif",
            fontSize: "0.85rem",
            color: "#888",
            marginTop: "24px",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            style={{ color: "#F27A9F", textDecoration: "none", fontWeight: 600 }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
