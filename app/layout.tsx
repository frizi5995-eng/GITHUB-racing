import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "RACEHUB",
  description: "Auto sacensību kalendārs Latvijai, Baltijai un pasaulei",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lv" suppressHydrationWarning>
      <body className={inter.className}>
        <Nav />
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">{children}</div>
      </body>
    </html>
  );
}
