"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleSignOut}
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
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "0.85";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
    >
      Sign out
    </button>
  );
}
