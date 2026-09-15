import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { CatalystProvider } from "@/components/catalyst-provider";
import "./globals.css";
import "./shell-theme.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Catalyst — focus tool for IB DP",
  description:
    "For IB DP students. Apps pull you off ManageBac. Catalyst locks them until a session finishes. Tokens come from that work, then you buy a short unlock.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`light ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("catalyst-v1:ui-theme");if(t==="dark"){document.documentElement.classList.remove("light");document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}}catch(e){}',
          }}
        />
        <CatalystProvider>{children}</CatalystProvider>
      </body>
    </html>
  );
}
