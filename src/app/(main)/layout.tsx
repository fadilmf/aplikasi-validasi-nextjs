import Navbar from "@/components/Navbar";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import BottomNavbar from "@/components/BottomNavbar";
import AuthProvider from "@/components/AuthProviders";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aplikasi Validasi",
  description: "Aplikasi Validasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <NextTopLoader />
          <Navbar />
          <main className="flex-grow mt-14">
            <AuthProvider>{children}</AuthProvider>
          </main>
          <BottomNavbar />
        </div>
      </body>
    </html>
  );
}
