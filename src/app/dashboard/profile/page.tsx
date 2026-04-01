import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/auth/SignOutButton";
import Link from "next/link";
import { checkProStatus } from "@/lib/pro-status";
import ProfileEditor from "@/components/dashboard/ProfileEditor";
import ManageSubscriptionButton from "@/components/dashboard/ManageSubscriptionButton";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPro = user?.email ? await checkProStatus(user.email) : false;

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
        Profile
      </h1>

      <div
        style={{
          background: "var(--w)",
          borderRadius: "14px",
          padding: "32px",
          border: "2px solid var(--ink)",
          maxWidth: "500px",
        }}
      >
        {/* Avatar & Name — editable */}
        <ProfileEditor
          avatarUrl={user?.user_metadata?.avatar_url || null}
          fullName={user?.user_metadata?.full_name || ""}
          email={user?.email || ""}
          xHandle={user?.user_metadata?.x_handle || ""}
          website={user?.user_metadata?.website || ""}
        />

        {/* Plan Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            paddingBottom: "24px",
            borderBottom: "1.5px solid rgba(0,0,0,.08)",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "var(--ink)",
                marginBottom: "2px",
              }}
            >
              {isPro ? "Pro Plan" : "Current Plan"}
            </p>
            <p
              style={{
                fontFamily: "'Oxygen', sans-serif",
                fontSize: "0.85rem",
                color: "var(--im)",
              }}
            >
              {isPro ? "Pro — Unlimited exports, no watermark" : "Free — first 5 exports"}
            </p>
          </div>
          {isPro ? (
            <ManageSubscriptionButton />
          ) : (
            <Link
              href="/dashboard/pricing"
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
              }}
            >
              Upgrade
            </Link>
          )}
        </div>

        {/* Sign Out */}
        <SignOutButton />
      </div>
    </div>
  );
}
