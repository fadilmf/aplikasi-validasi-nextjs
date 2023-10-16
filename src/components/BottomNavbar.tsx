"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdAdminPanelSettings, MdHome, MdSearch } from "react-icons/md";

export default function BottomNavbar() {
  const pathname = usePathname();

  const { data: session } = useSession();

  const isAdmin = session?.user.role === "admin";

  return (
    <>
      <nav className="bg-white rounded-t-xl shadow-inner md:hidden bottom-0 w-full fixed">
        <div className="container mx-auto">
          <ul className="flex flex-wrap justify-around text-green-800 ">
            <li className="flex-grow-0 flex-shrink-0 w-1/3 md:w-auto">
              <Link
                href={"/"}
                className={`flex flex-col items-center justify-center py-2 rounded-t-xl hover:bg-gray-200 ${
                  pathname === "/" ? "text-green-800" : "text-gray-400"
                } transition-colors`}
              >
                <MdHome className="text-4xl" />
                Home
              </Link>
            </li>
            <li className="flex-grow-0 flex-shrink-0 w-1/3 md:w-auto">
              <Link
                href={"/validasi"}
                className={`flex flex-col items-center justify-center py-2 rounded-t-xl hover:bg-gray-200 ${
                  pathname === "/validasi" ? "text-green-800" : "text-gray-400"
                } transition-colors`}
              >
                <MdSearch className="text-4xl" />
                Validasi
              </Link>
            </li>
            {isAdmin && (
              <li className="flex-grow-0 flex-shrink-0 w-1/3 md:w-auto">
                <Link
                  href={"/dashboard"}
                  className={`flex flex-col items-center justify-center py-2 rounded-t-xl hover:bg-gray-200 ${
                    pathname.startsWith("/dashboard")
                      ? "text-green-800"
                      : "text-gray-400"
                  } transition-colors`}
                >
                  <MdAdminPanelSettings className="text-4xl" />
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}
