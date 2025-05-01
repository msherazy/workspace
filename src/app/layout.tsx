import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Focus Dashboard',
  description: 'Track your productivity and focus time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
