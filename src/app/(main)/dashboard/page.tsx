"use client";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/types/User";
import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";
import { MdClose, MdDelete, MdDone, MdEdit } from "react-icons/md";

export default function DashboardPage() {
  // const [isUser, setIsUser] = useState(false);

  // const session = await getServerSession(authOptions);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [editId, setEditId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [regional, setRegional] = useState(0);
  const [role, setRole] = useState("user");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [users, setUsers] = useState<User[]>([]);

  const handleEditClick = (user: any) => {
    setEditId(user._id);
    setUsername(user.username);
    setRegional(user.regional);
    setRole(user.role);
  };

  const handleCancelEditClick = () => {
    setEditId("");
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/admin/edit-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          regional,
          role,
          editId,
        }),
      });

      if (res.ok) {
        setEditId("");
        setSuccessMessage("User berhasil terupdate");
        setErrorMessage("");
      } else {
        const data = await res.json();
        setSuccessMessage("");
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Error during user update:", error);
      setErrorMessage("Terjadi kesalahan saat mengirim permintaan.");
      setSuccessMessage("");
    }
  };

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
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md mb-4">
              {successMessage}
            </div>
          )}
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
                {users.map((user) =>
                  String(user._id) === editId ? (
                    <tr key={String(user._id)} className="bg-blue-100">
                      <td className="border-b border-gray-300">
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                          type="password"
                          className="w-full p-2 border rounded"
                          placeholder="Enter new password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </td>
                      <td className="border-b border-gray-300">
                        <select
                          name="role"
                          value={role}
                          className="mt-1 p-2 border rounded w-full"
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                        <select
                          name="regional"
                          value={regional}
                          className="mt-1 p-2 border rounded w-full"
                          onChange={(e) => setRegional(Number(e.target.value))}
                        >
                          <option value={0}>All Regional</option>
                          <option value={1}>Regional 1</option>
                          <option value={2}>Regional 2</option>
                          <option value={3}>Regional 3</option>
                          <option value={4}>Regional 4</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-300 text-sm leading-5 font-medium flex gap-2">
                        <button
                          onClick={handleUpdate}
                          className="bg-white hover:bg-gray-100 rounded-full p-2"
                        >
                          <MdDone className="text-green-500 text-xl" />
                        </button>
                        <button
                          onClick={() => handleCancelEditClick()}
                          className="bg-white hover:bg-gray-100 rounded-full p-2"
                        >
                          <MdClose className="text-red-500 text-xl" />
                        </button>
                      </td>
                    </tr>
                  ) : (
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
                      <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-300 text-sm leading-5 font-medium flex gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                        >
                          <MdEdit className="text-green-500 text-xl" />
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 rounded-full p-2">
                          <MdDelete className="text-red-500 text-xl" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
