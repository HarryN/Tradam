import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/auth/context/auth-context";
import Header from '@/components/Header';

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
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans bg-neutral-bg text-neutral-text">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}


