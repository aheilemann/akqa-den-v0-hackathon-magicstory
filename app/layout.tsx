import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Navigation } from "@/components/organisms/navigation";
import { Footer } from "@/components/organisms/footer";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";

const cabinetGrotesk = localFont({ src: "../public/fonts/CabinetGrotesk-Regular.woff2" });

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "🪄 MagicStory.AI",
  description: "Create immersive stories with AI",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cabinetGrotesk.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center">
              <Navigation />
              <div className="flex flex-col gap-20 w-full">{children}</div>
              <Footer />
            </div>
          </main>
        </ThemeProvider>
        <Toaster position="bottom-right" />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
