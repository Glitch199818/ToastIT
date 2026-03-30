import Link from "next/link";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; next?: string }>;
}) {
  const params = await searchParams;
  const plan = params.plan; // "monthly" or "annual" from landing page Go Pro
  const next = params.next;

  // Build the redirect path for after OAuth
  let postAuthRedirect = "/dashboard/create";
  if (plan === "monthly" || plan === "annual") {
    postAuthRedirect = `/api/polar/checkout-redirect?plan=${plan}`;
  } else if (next) {
    postAuthRedirect = next;
  }

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
          Create your account
        </h1>
        <p
          style={{
            fontFamily: "'Oxygen', sans-serif",
            fontSize: "0.95rem",
            color: "#4A4A4A",
            marginBottom: "32px",
          }}
        >
          Start toasting your milestones
        </p>

        <GoogleSignInButton redirectAfterAuth={postAuthRedirect} />

        <p
          style={{
            fontFamily: "'Oxygen', sans-serif",
            fontSize: "0.85rem",
            color: "#888",
            marginTop: "24px",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/auth/login"
            style={{ color: "#F27A9F", textDecoration: "none", fontWeight: 600 }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
