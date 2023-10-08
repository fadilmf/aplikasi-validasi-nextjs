"use client";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { useState } from "react";

export default function DashboardPage() {
  const [isUser, setIsUser] = useState(false);

  // const session = await getServerSession(authOptions);

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Dashboard Page</h1>
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setIsUser(false)}
            className={`px-4 py-2 rounded-full text-white w-full ${
              !isUser ? `bg-green-800` : `bg-gray-300`
            }`}
          >
            Manage Devices
          </button>
          <button
            onClick={() => setIsUser(true)}
            className={`px-4 py-2 rounded-full text-white w-full ${
              isUser ? `bg-green-800` : `bg-gray-300`
            }`}
          >
            Manage Users
          </button>
        </div>
      </div>
    </>
  );
}
