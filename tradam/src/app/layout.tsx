import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/context/auth-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tradam | Cameroon Multi-Vendor E-Commerce Platform",
  description: "Discover and purchase quality products from local sellers in Cameroon, powered by Tradam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-neutral-bg text-neutral-text">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
