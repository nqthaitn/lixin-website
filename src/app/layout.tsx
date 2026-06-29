import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        {children}
        {/* Privacy-friendly traffic stats (visits / uniques / top pages) — no cookies, no PII. */}
        <Analytics />
      </body>
    </html>
  );
}
