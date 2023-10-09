import "../../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";

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
    <>
      <div className="flex flex-col md:flex-row justify-start">
        <Sidebar />
        <div className="flex-grow mb-20">{children}</div>
      </div>
    </>
  );
}
