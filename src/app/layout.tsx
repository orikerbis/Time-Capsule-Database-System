import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import BackToTopBtn from "./components/BackToTopBtn";

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: "--font-playfair-display",
  weight: ['400', '500', '600', '700', '800', '900'],
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
        {children}
        <BackToTopBtn />
      </body>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh950GNyZPhcTNXj1NW7RuBCsyN/o0jlpcV80yq46cDfL"
        crossOrigin="anonymous"
      ></script>
    </html>
  );
}
