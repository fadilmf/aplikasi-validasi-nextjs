"use client";

import { useRef, useState } from "react";
import witelList from "@/util/witel.json";

export default function UserPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [regional, setRegional] = useState(0);
  const [witel, setWitel] = useState("all");
  const [role, setRole] = useState("user");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          regional,
          witel,
          role,
        }),
      });

      if (res.ok) {
        setUsername("");
        setPassword("");
        setRegional(0);
        setRole("user");
        setErrorMessage("");
        setSuccessMessage("User berhasil ditambahkan.");
      } else {
        setSuccessMessage("");
        setErrorMessage((await res.json()).message);
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Add User</h1>
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md mb-4">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Regional:</label>
            <select
              name="regional"
              value={regional}
              onChange={(e) => setRegional(Number(e.target.value))}
              className="mt-1 p-2 border rounded w-full"
              required
            >
              {/* <option value={0}>All Regional</option>
              <option value={1}>Regional 1</option>
              <option value={2}>Regional 2</option>
              <option value={3}>Regional 3</option>
              <option value={4}>Regional 4</option>
              <option value={5}>Regional 5</option>
              <option value={6}>Regional 6</option>
              <option value={7}>Regional 7</option>
               */}
              <option value={0}>All Regional</option>
              {Object.keys(witelList).map((reg, i) => (
                <option key={i} value={reg}>
                  Regional {reg}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Witel:</label>
            <select
              name="witel"
              value={witel}
              onChange={(e) => setWitel(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
              required
            >
              {/* <option value="all">All Witel</option>
              <option value="aceh">Aceh</option>
              <option value="medan">Medan</option>
              <option value="siantar">Siantar</option>
              <option value="batam">Batam</option>
              <option value="palembang">Palembang</option>
              <option value="jambi">Jambi</option>
              <option value="padang">Padang</option>
              <option value="pekanbaru">Pekanbaru</option>
              <option value="lampung">Lampung</option>
              <option value="bengkulu">Bengkulu</option>
              <option value="babel">Babel</option> */}
              {regional != 0 ? (
                (witelList as any)[regional].map((wit: string, i: number) => (
                  <option key={i} value={wit}>
                    {wit}
                  </option>
                ))
              ) : (
                <option value="all">All Witel</option>
              )}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role:</label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {/* <div className="mb-4">
            <label className="block text-gray-700">
              Admin:
              <input
                type="checkbox"
                name="admin"
                checked={admin}
                onChange={(e) => setAdmin(e.target.checked)}
                className="ml-2"
              />
            </label>
          </div> */}
          <div className="mt-4">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
