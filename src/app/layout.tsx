import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/toaster";
import Nav from "@/components/home/Nav";
import Footer from "@/components/home/Footer";
import ScrollToTop from "@/components/helpers/ScrollToTop";

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
          <Nav />
          {children}
          <Footer />
          <ScrollToTop />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
