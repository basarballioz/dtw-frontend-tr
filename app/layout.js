import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Destekli Ürün Arama | Hızlı ve Akıllı Sonuçlar",
  description: "Yapay zeka destekli arama ile ürünleri hızlıca bulun, kullanıcı yorumlarını analiz edin ve en iyi sonuçlara kolayca ulaşın.",
  keywords: [
    "AI arama",
    "ürün arama",
    "yapay zeka",
    "hızlı sonuçlar",
    "yorum analizi",
    "e-ticaret"
  ],
  author: "dtw-frontend-tr ekibi",
  icons: {
    icon: "/favicon.ico"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
