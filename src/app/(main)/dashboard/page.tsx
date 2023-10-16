"use client";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/types/User";
import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  // const [isUser, setIsUser] = useState(false);

  // const session = await getServerSession(authOptions);

  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    return data.users;
  };

  useEffect(() => {
    fetchUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Dashboard Page</h1>
        {/* <div className="flex justify-center gap-2 mb-4">
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
        </div> */}
        <div className="container mx-auto p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 border-b border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 bg-gray-50 border-b border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 bg-gray-50 border-b border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Regional
                  </th>
                  <th className="px-6 py-3 bg-gray-50 border-b border-gray-300"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={String(user._id)}>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm leading-5 font-medium text-gray-900">
                            {user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                      <div className="text-sm leading-5 text-gray-900">
                        {user.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                      <div className="text-sm leading-5 text-gray-900">
                        {user.regional}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-300 text-sm leading-5 font-medium">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
