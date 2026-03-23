import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToastIT — Turn your milestones into doodles",
  description:
    "Your milestone deserves more than a text tweet. Get hand-drawn drink doodle visuals that make people stop and spark conversations.",
  openGraph: {
    title: "ToastIT — Turn your milestones into doodles",
    description:
      "Hand-drawn drink doodle cards for your X/Twitter milestones. Pick a drink, drop your number, toast it.",
    url: "https://toastit.app",
    siteName: "ToastIT",
    type: "website",
    images: [
      {
        url: "https://toastit.app/screenshots/post-900-cocktail.png",
        width: 1336,
        height: 800,
        alt: "ToastIT — 900 Followers milestone card with cocktail doodle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToastIT — Turn your milestones into doodles",
    description:
      "Hand-drawn drink doodle cards for your X/Twitter milestones. Pick a drink, drop your number, toast it.",
    site: "@sushbuilds",
    images: ["https://toastit.app/screenshots/post-900-cocktail.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@700&family=Odor+Mean+Chey&family=Oxygen:wght@300;400;700&family=Rowdies:wght@300;400;700&family=Seaweed+Script&family=Roboto:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
