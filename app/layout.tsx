import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";
import AuthGuard from "@/components/auth/AuthGuard";
import { Nunito } from "next/font/google";
import { ToastProvider } from "@/components/notification/ToastProvider";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TopCV Clone",
  description: "Job platform",
};

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className= {`${nunito.variable} no-scrollbar`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${inter.className} bg-white no-crollbar`}>
        <ToastProvider>
          <AuthProvider>
            <LocationProvider>
              <AuthGuard>
                {children}
              </AuthGuard>
            </LocationProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
