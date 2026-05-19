import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import "./listing-detail.css";
import "./booking-modal.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.albaith.in"),
  alternates: {
    canonical: "https://www.albaith.in",
  },
  title: {
    default: "Al Baith Rest House — Luxury Hotel in Ernakulam, Kerala",
    template: "%s | Al Baith Rest House",
  },
  description:
    "Experience Arabian luxury at Al Baith Rest House, Ernakulam, Kerala. Premium rooms, 24/7 power backup, free Wi-Fi, and unbeatable hospitality near Lakeshore Hospital, Kochi.",
  keywords: [
    "Al Baith",
    "rest house",
    "hotel Ernakulam",
    "Kerala hotel",
    "luxury rooms Kochi",
    "budget hotel Ernakulam",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Al Baith Rest House",
    title: "Al Baith Rest House — Luxury Hotel in Ernakulam, Kerala",
    description:
      "Premium rooms with free Wi-Fi, AC, 24/7 power backup. Book your stay at Al Baith Rest House, Ernakulam.",
    images: ["/images/webp/rooms/standard_1.webp"],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* GSAP from CDN - needed by many components */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
          defer
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
          defer
        />
      </head>
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              fontFamily: "var(--font-body)",
              borderRadius: "12px",
              background: "#162118",
              color: "#F5F0E8",
              border: "1px solid rgba(201,169,110,0.3)",
            },
          }}
        />
        {/* Islamic geometric pattern background */}
        <div className="islamic-pattern-bg" />
      </body>
    </html>
  );
}
