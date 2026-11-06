import "./globals.css";
import { Fraunces, Instrument_Sans } from "next/font/google";
const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });
export const metadata = { title: "Vow — wedding planning for two" };
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${display.variable} ${sans.variable}`}><body>{children}</body></html>;
}
