"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdDensityMedium,
  MdDevices,
  MdPersonAdd,
  MdSettings,
} from "react-icons/md";

const menuItems = [
  { id: 1, label: "Dashboard", icon: MdDashboard, link: "/dashboard" },
  { id: 2, label: "Add User", icon: MdPersonAdd, link: "/dashboard/users" },
  {
    id: 3,
    label: "Add Supervisor",
    icon: MdPersonAdd,
    link: "/dashboard/supervisors",
  },
  { id: 4, label: "Add Device", icon: MdDevices, link: "/dashboard/devices" },
  {
    id: 5,
    label: "Admin Settings",
    icon: MdSettings,
    link: "/dashboard/settings",
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const sidebarItem = `${isOpen ? "justify-start" : "justify-center"}`;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleResize = () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    setIsOpen(!isMobile);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      {/* Sidebar Toggle Mobile */}
      <div className="flex md:hidden pl-4 pt-4 text-2xl">
        <button
          className="border border-slate-400 rounded-md p-1 hover:bg-slate-100"
          onClick={toggleSidebar}
        >
          <MdDensityMedium />
        </button>
      </div>
      {/*  */}

      {/* Sidebar */}
      <div
        className={`md:flex h-screen transition-all ${
          isOpen ? "" : "hidden"
        } md:${isOpen ? "w-80" : "w-20"} fixed`}
      >
        <div className="h-screen px-4 pt-8 pb-4 bg-slate-50 flex justify-between flex-col border shadow-sm">
          <div className="flex flex-col">
            <div className="flex items-center justify-between relative mb-16 pl-1 gap-4 text-2xl">
              {isOpen && <h1 className={`font-bold`}>Admin Dashboard</h1>}
              <button
                className="border border-slate-400 rounded-md p-1 hover:bg-slate-100"
                onClick={toggleSidebar}
              >
                <MdDensityMedium />
              </button>
            </div>
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                onClick={() =>
                  window.matchMedia("(max-width: 768px)").matches &&
                  setIsOpen(false)
                }
                className={`p-2 rounded flex flex-row items-center ${sidebarItem} gap-3 ${
                  pathname === item.link
                    ? "bg-green-600 text-white font-medium"
                    : "hover:bg-gray-200 "
                }`}
              >
                <item.icon className={`text-2xl`} />
                {isOpen && <div>{item.label}</div>}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`hidden md:flex md:h-screen ${isOpen ? "w-80" : "w-20"} `}
      ></div>
    </>
  );
}
