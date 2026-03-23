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
        fontSize: "0.85rem",
        color: "#1A1A1A",
        background: "transparent",
        border: "2px solid #1A1A1A",
        padding: "8px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#F27A9F";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      Sign out
    </button>
  );
}
