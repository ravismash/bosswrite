import Footer from "@/components/Footer";
import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* min-h-screen + flex-col ensures the footer stays at the bottom */}
      <body className="flex min-h-screen flex-col">
        {/* flex-1 allows the main content to grow and push the footer down */}
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}