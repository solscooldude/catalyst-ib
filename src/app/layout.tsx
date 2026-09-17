import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { CatalystProvider } from "@/components/catalyst-provider";
import "./globals.css";
import "./shell-theme.css";
import "./appearance-theme.css";
import "./task-picker.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catalyst — focus tool for IB DP",
  description:
    "For IB DP students. Phone apps pull you off homework. Focus sessions earn tokens. Then you buy a short unlock for the apps that steal the block.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${plusJakarta.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("catalyst-v1:ui-theme");var d=t!=="light";document.documentElement.classList.toggle("dark",d);document.documentElement.classList.toggle("light",!d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}',
          }}
        />
        <CatalystProvider>{children}</CatalystProvider>
      </body>
    </html>
  );
}
