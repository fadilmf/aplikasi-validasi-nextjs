"use client";

import { useRef, useState } from "react";
import witelList from "@/util/witel.json";
import Papa from "papaparse";

export default function UserPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [regional, setRegional] = useState(0);
  const [witel, setWitel] = useState("all");
  const [role, setRole] = useState("user");

  const [isInputCSV, setIsInputCSV] = useState(false);

  const [csvData, setCsvData] = useState<any[]>([]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [failedUsers, setFailedUsers] = useState<any[]>([]);
  const [isFailedMenuOpen, setIsFailedMenuOpen] = useState(false);

  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const changeRegional = (reg: number) => {
    setRegional(reg);
    setWitel("all");
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files!![0];

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data;
        setCsvData(data);
      },
    });
  };

  const handleCsvSubmit = async () => {
    setIsBtnLoading(true);
    const res = await fetch("/api/admin/users/csv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: csvData }),
    });

    const json = await res.json();

    if (res.ok) {
      setSuccessMessage(json.message);
      if (json.failed.length > 0) {
        setErrorMessage(json.failed.length + " user gagal ditambahkan");
      }

      setFailedUsers(json.failed);
    } else {
      setErrorMessage(json.message);
    }
    setIsBtnLoading(false);
  };

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
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setIsInputCSV(false)}
            className={`px-4 py-2 rounded-full text-white w-full ${
              !isInputCSV ? `bg-green-800` : `bg-gray-300`
            }`}
          >
            Form
          </button>
          <button
            onClick={() => setIsInputCSV(true)}
            className={`px-4 py-2 rounded-full text-white w-full ${
              isInputCSV ? `bg-green-800` : `bg-gray-300`
            }`}
          >
            CSV
          </button>
        </div>
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
        {failedUsers.length > 0 && (
          <>
            <div className="mb-3">
              <button
                onClick={() => setIsFailedMenuOpen(!isFailedMenuOpen)}
                className="bg-slate-500 hover:bg-slate-600 text-white py-2 px-4 rounded-full"
              >
                Lihat {failedUsers.length} user yang gagal
              </button>
            </div>
            {isFailedMenuOpen && (
              <div className="flex justify-center items-center p-2 bg-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-screen-md">
                  {failedUsers.map((user, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-md shadow-md"
                    >
                      <p className="font-bold text-gray-800">
                        Username: {user.username}
                      </p>
                      <p className="text-red-500">
                        Gagal diupload: {user.error}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {isInputCSV && (
          <div className="mb-4">
            <input type="file" accept=".csv" onChange={handleCSVUpload} />
            <div className="mt-3">
              <button
                onClick={handleCsvSubmit}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full disabled:opacity-25 transition-opacity"
                disabled={isBtnLoading}
              >
                Add CSV
              </button>
            </div>
          </div>
        )}
        {!isInputCSV && (
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
                onChange={(e) => changeRegional(Number(e.target.value))}
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
                <option value="all">All Witel</option>
                {regional != 0 &&
                  (witelList as any)[regional].map((wit: string, i: number) => (
                    <option key={i} value={wit}>
                      {wit}
                    </option>
                  ))}
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
                <option value="viewer">Viewer</option>
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
        )}
      </div>
    </>
  );
}
