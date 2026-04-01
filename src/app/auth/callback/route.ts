import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "sush@toastit.app";
const FROM_EMAIL = process.env.FROM_EMAIL || "ToastIT <hello@toastit.app>";

async function sendWelcomeEmails(email: string, name: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://toastit.app";

  try {
    await Promise.allSettled([
      // Welcome email to user
      resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Your milestones just got an upgrade",
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #FFFDF5; border-radius: 16px; padding: 40px 32px; border: 2px solid #f0e8d0;">
            <h1 style="font-family: Georgia, serif; font-size: 28px; color: #1A1A1A; margin: 0 0 12px;">
              Hey ${name}, welcome to ToastIT!
            </h1>
            <p style="font-size: 15px; color: #4A4A4A; line-height: 1.6; margin: 0 0 20px;">
              You just joined a community of creators who celebrate their wins the fun way — with hand-drawn doodle cards instead of boring text tweets.
            </p>
            <p style="font-size: 15px; color: #1A1A1A; font-weight: 700; margin: 0 0 8px;">Here's how to get started:</p>
            <ol style="font-size: 14px; color: #4A4A4A; line-height: 1.8; margin: 0 0 24px; padding-left: 20px;">
              <li><strong>Pick a drink</strong> — choose from our collection of hand-drawn doodles</li>
              <li><strong>Drop your milestone</strong> — add your number, handle, and pick a color</li>
              <li><strong>Share it</strong> — download your card and post it on X</li>
            </ol>
            <p style="font-size: 14px; color: #4A4A4A; margin: 0 0 12px;">It takes about 10 seconds. Seriously.</p>
            <p style="font-size: 14px; color: #4A4A4A; margin: 0 0 24px;">Tag <a href="https://x.com/sushbuilds" style="color: #F27A9F; text-decoration: none; font-weight: 700;">@sushbuilds</a> on X to get a repost!</p>
            <a href="${siteUrl}/dashboard/create" style="display: inline-block; background: #F27A9F; color: #fff; font-weight: 700; font-size: 16px; padding: 14px 32px; border-radius: 10px; text-decoration: none; border: 2px solid #1A1A1A;">
              Start Toasting
            </a>
            <p style="font-size: 14px; color: #4A4A4A; margin-top: 28px; margin-bottom: 4px;">Got questions? Just reply to this email.</p>
            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e8e0c8;">
              <p style="font-size: 14px; color: #4A4A4A; margin: 0;">Cheers,</p>
              <p style="font-size: 14px; color: #1A1A1A; font-weight: 700; margin: 4px 0 2px;">Sush</p>
              <p style="font-size: 13px; color: #888; margin: 0 0 6px;">Creator of ToastIT</p>
              <p style="font-size: 13px; margin: 0;">
                <a href="https://toastit.app" style="color: #F27A9F; text-decoration: none;">ToastIT</a>
                &nbsp;|&nbsp;
                <a href="https://x.com/sushbuilds" style="color: #F27A9F; text-decoration: none;">X</a>
              </p>
            </div>
          </div>
        `,
      }),

      // Notification to admin
      resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New ToastIT signup: ${email}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; padding: 20px;">
            <h2 style="margin: 0 0 12px;">New user signed up!</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          </div>
        `,
      }),
    ]);
  } catch (err) {
    console.error("Failed to send welcome emails:", err);
  }
}

// Prevent open redirect attacks — only allow internal paths
function sanitizeRedirect(next: string | null): string {
  const fallback = "/dashboard/create";
  if (!next) return fallback;
  // Must start with / and not start with // (protocol-relative URL)
  if (!next.startsWith("/") || next.startsWith("//")) return fallback;
  // Block any URL that could be parsed as absolute (e.g., /\evil.com)
  try {
    const url = new URL(next, "http://localhost");
    if (url.hostname !== "localhost") return fallback;
  } catch {
    return fallback;
  }
  return next;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeRedirect(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if this is a new user and send welcome emails
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const createdAt = new Date(user.created_at);
        const now = new Date();
        const isNewUser = now.getTime() - createdAt.getTime() < 300_000; // within last 5 minutes

        console.log("Auth callback:", {
          email: user.email,
          isNewUser,
          createdAt: user.created_at,
          timeDiff: now.getTime() - createdAt.getTime(),
        });

        if (isNewUser) {
          const name = user.user_metadata?.full_name || user.user_metadata?.name || "there";

          // Await emails so serverless doesn't kill the function before sending
          await sendWelcomeEmails(user.email!, name);

          // Insert welcome notification
          try {
            const admin = createAdminClient();
            await admin.from("notifications").insert({
              user_id: user.id,
              type: "welcome",
              message: `Welcome to ToastIT, ${name}! Pick a drink, drop your milestone, and share your first card. Tag @sushbuilds on X to get a repost!`,
              read: false,
            });
          } catch (err) {
            console.error("Failed to insert welcome notification:", err);
          }
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
