/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileEditor({
  avatarUrl,
  fullName,
  email,
  xHandle: initialXHandle,
}: {
  avatarUrl: string | null;
  fullName: string;
  email: string;
  xHandle?: string;
}) {
  const [name, setName] = useState(fullName);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl);
  const [xHandle, setXHandle] = useState(initialXHandle || "");
  const [editingHandle, setEditingHandle] = useState(false);
  const [savingHandle, setSavingHandle] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { full_name: name },
      });
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileName = `${user.id}/avatar.${file.name.split(".").pop()}`;
      await supabase.storage.from("card-images").upload(fileName, file, {
        contentType: file.type,
        upsert: true,
      });

      const { data: urlData } = supabase.storage.from("card-images").getPublicUrl(fileName);

      await supabase.auth.updateUser({
        data: { avatar_url: urlData.publicUrl },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1.5px solid rgba(0,0,0,.08)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
      {/* Avatar with change option */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Avatar"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              border: "2px solid var(--ink)",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => fileRef.current?.click()}
          />
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "var(--pink)",
              border: "2px solid var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 700,
              fontSize: "1.4rem",
              color: "var(--ink)",
              cursor: "pointer",
            }}
          >
            {(fullName || email || "?")[0].toUpperCase()}
          </div>
        )}
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            position: "absolute",
            bottom: "-2px",
            right: "-2px",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: "var(--pink)",
            border: "2px solid var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ display: "none" }}
        />
      </div>

      {/* Name & Email */}
      <div style={{ flex: 1 }}>
        {editing ? (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: "8px 12px",
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--ink)",
                background: "var(--bg)",
                border: "2px solid var(--ink)",
                borderRadius: "10px",
                outline: "none",
                flex: 1,
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--pink)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--ink)")}
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                fontFamily: "'Rowdies', cursive",
                fontSize: "0.7rem",
                color: "var(--ink)",
                background: "var(--pink)",
                border: "2px solid var(--ink)",
                padding: "8px 14px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              {saving ? "..." : "Save"}
            </button>
            <button
              onClick={() => { setName(fullName); setEditing(false); }}
              style={{
                fontFamily: "'Oxygen', sans-serif",
                fontSize: "0.75rem",
                color: "var(--im)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <p
              style={{
                fontFamily: "'Kanit', sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "var(--ink)",
              }}
            >
              {name || "User"}
            </p>
            <button
              onClick={() => setEditing(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
                opacity: 0.4,
              }}
              title="Edit name"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          </div>
        )}
        <p
          style={{
            fontFamily: "'Oxygen', sans-serif",
            fontSize: "0.85rem",
            color: "var(--im)",
            marginTop: editing ? "6px" : "0",
          }}
        >
          {email}
        </p>
      </div>
      </div>

      {/* X Handle Section */}
      <div style={{
        marginTop: "14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--ink)">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        {editingHandle ? (
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flex: 1 }}>
            <span style={{
              fontFamily: "'Oxygen', sans-serif",
              fontSize: "0.9rem",
              color: "var(--im)",
            }}>@</span>
            <input
              type="text"
              value={xHandle}
              onChange={(e) => setXHandle(e.target.value.replace(/^@/, ""))}
              placeholder="yourhandle"
              style={{
                padding: "8px 12px",
                fontFamily: "'Oxygen', sans-serif",
                fontSize: "0.85rem",
                color: "var(--ink)",
                background: "var(--bg)",
                border: "2px solid var(--ink)",
                borderRadius: "10px",
                outline: "none",
                flex: 1,
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--pink)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--ink)")}
              autoFocus
            />
            <button
              onClick={async () => {
                setSavingHandle(true);
                try {
                  const supabase = createClient();
                  await supabase.auth.updateUser({
                    data: { x_handle: xHandle },
                  });
                  setEditingHandle(false);
                } catch (err) {
                  console.error(err);
                } finally {
                  setSavingHandle(false);
                }
              }}
              disabled={savingHandle}
              style={{
                fontFamily: "'Rowdies', cursive",
                fontSize: "0.7rem",
                color: "var(--ink)",
                background: "var(--pink)",
                border: "2px solid var(--ink)",
                padding: "8px 14px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              {savingHandle ? "..." : "Save"}
            </button>
            <button
              onClick={() => { setXHandle(initialXHandle || ""); setEditingHandle(false); }}
              style={{
                fontFamily: "'Oxygen', sans-serif",
                fontSize: "0.75rem",
                color: "var(--im)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
            <p style={{
              fontFamily: "'Oxygen', sans-serif",
              fontSize: "0.85rem",
              color: xHandle ? "var(--ink)" : "var(--im)",
            }}>
              {xHandle ? `@${xHandle}` : "Add your X handle"}
            </p>
            <button
              onClick={() => setEditingHandle(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
                opacity: 0.4,
              }}
              title="Edit X handle"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
