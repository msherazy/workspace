import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Next App",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="dark-mode-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const darkMode = localStorage.getItem('darkMode');
                if (darkMode === 'true') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                console.error('Dark mode initialization failed:', e);
              }
            })();
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
