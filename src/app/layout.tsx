import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Splitwise Clone",
  description: "A simple expense sharing app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
