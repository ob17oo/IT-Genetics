import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "./providers/app-providers";


export const metadata: Metadata = {
  title: "Browser game",
  description: "Game made with Three.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
            {children}
        </AppProviders>
      </body>
    </html>
  );
}
