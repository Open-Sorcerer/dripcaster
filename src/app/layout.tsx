"use client";

import "./globals.css";
import { Navbar } from "@/components";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen bg-gradient-radial from-[#191919] via-[#1c1c1c] to-[#000000]">
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
