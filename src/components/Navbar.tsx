"use client";

import Link from "next/link";
import { MdLogout } from "react-icons/md";
import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <>
      <nav className="bg-green-800 px-3 md:px-10 py-3 top-0 w-full fixed z-10">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <Link href={"/"} className="text-white text-xl font-semibold">
              Aplikasi Validasi
            </Link>
            <ul className="flex items-center gap-4">
              <div className="hidden md:flex space-x-4">
                <li className="text-white">
                  <Link href={"/"}>Home</Link>
                </li>
                <li className="text-white">
                  <Link href={"/validasi"}>Validasi</Link>
                </li>
                <li className="text-white">
                  <Link href={"/dashboard"}>Admin Dashboard</Link>
                </li>
              </div>
              <li className="text-white">
                <button onClick={() => signOut()}>
                  <div className="flex items-center border px-2 py-1 rounded-lg hover:bg-red-500 hover:border-red-500 hover:scale-95 transition-all gap-2">
                    <MdLogout />
                    Logout
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
