import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "./footer";

const font = Plus_Jakarta_Sans({ 
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Portal",
  description: "A place to find your dream job",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ConvexClientProvider>
          <Toaster />
          <Header />
          {children}
          <Footer />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
