import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import Navbar from "./Navbar";
import { SessionProvider } from "next-auth/react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TimeLock",
  description: "Moment frozen in time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${playfair.variable}`}>
      <Navbar />
        {children}
      </body>
    </html>
  );
}
