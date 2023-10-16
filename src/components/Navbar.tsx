"use client";

import Link from "next/link";
import { MdLogout, MdPerson } from "react-icons/md";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { data: session } = useSession();

  const isAdmin = session?.user.role === "admin";

  const toggleMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

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
                {isAdmin && (
                  <li className="text-white">
                    <Link href={"/dashboard"}>Admin Dashboard</Link>
                  </li>
                )}
              </div>
              <li className="text-white relative">
                <button
                  className="p-1 bg-slate-200 text-gray-600 text-3xl rounded-full"
                  onClick={toggleMenu}
                >
                  <MdPerson />
                </button>
                {isProfileOpen && (
                  <div className="absolute top-2 right-0 mt-8 w-48">
                    <ul className="bg-white text-black rounded-lg outline-2 shadow-lg py-4 px-4 flex flex-col justify0center space-y-3">
                      <li>
                        <Link href={"/profile"} onClick={toggleMenu}>
                          <div className="flex items-center gap-2">
                            <MdPerson />
                            Edit Profile
                          </div>
                        </Link>
                      </li>
                      <hr />
                      <li>
                        <button onClick={() => signOut()}>
                          <div className="flex items-center gap-2">
                            <MdLogout />
                            Logout
                          </div>
                        </button>
                        {/* <div className="flex items-center">
                          <MdLogout />
                          Logout
                        </div> */}
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
