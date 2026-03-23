import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/auth/SignOutButton";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ padding: "32px 40px" }}>
      <h1
        style={{
          fontFamily: "'Odor Mean Chey', serif",
          fontWeight: 400,
          fontSize: "1.8rem",
          color: "var(--ink)",
          marginBottom: "32px",
        }}
      >
        Profile
      </h1>

      <div
        style={{
          background: "var(--w)",
          borderRadius: "20px",
          padding: "32px",
          border: "2px solid rgba(0,0,0,.05)",
          maxWidth: "500px",
        }}
      >
        {/* Avatar & Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
            paddingBottom: "24px",
            borderBottom: "1.5px solid rgba(0,0,0,.06)",
          }}
        >
          {user?.user_metadata?.avatar_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: "2px solid rgba(0,0,0,.08)",
              }}
            />
          ) : (
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--pink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 700,
                fontSize: "1.4rem",
                color: "var(--ink)",
              }}
            >
              {(user?.user_metadata?.full_name || user?.email || "?")[0].toUpperCase()}
            </div>
          )}
          <div>
            <p
              style={{
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "var(--ink)",
              }}
            >
              {user?.user_metadata?.full_name || "User"}
            </p>
            <p
              style={{
                fontFamily: "'Oxygen', sans-serif",
                fontSize: "0.85rem",
                color: "var(--im)",
              }}
            >
              {user?.email}
            </p>
          </div>
        </div>

        {/* Plan Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            paddingBottom: "24px",
            borderBottom: "1.5px solid rgba(0,0,0,.06)",
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
              Current Plan
            </p>
            <p
              style={{
                fontFamily: "'Oxygen', sans-serif",
                fontSize: "0.85rem",
                color: "var(--im)",
              }}
            >
              Free — 1 export per week
            </p>
          </div>
          <button
            style={{
              fontFamily: "'Rowdies', cursive",
              fontSize: "0.8rem",
              color: "var(--ink)",
              background: "var(--pink)",
              border: "2px solid var(--ink)",
              padding: "8px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Upgrade
          </button>
        </div>

        {/* Sign Out */}
        <SignOutButton />
      </div>
    </div>
  );
}
