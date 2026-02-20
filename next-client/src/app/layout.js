import { Inter, Cormorant_Garamond, Aref_Ruqaa } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant"
});
const aref = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-aref"
});

export const metadata = {
  title: "Al Baith — Luxury Hotel",
  description: "Experience the art of comfort and luxury.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${cormorant.variable} ${aref.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
