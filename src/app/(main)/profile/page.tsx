"use client";

import { useState } from "react";

export default function Profile() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Kata sandi baru dan konfirmasi kata sandi tidak cocok.");
      setSuccessMessage("");
      return;
    }

    try {
      const res = await fetch("/api/user/edit-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      console.log("currentPassword: ", currentPassword);
      console.log("newPassword: ", newPassword);

      if (res.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setSuccessMessage("Kata sandi berhasil diperbarui.");
        setErrorMessage("");
      } else {
        console.log("Password update failed");
        setSuccessMessage("");
        setErrorMessage((await res.json()).message);
      }
    } catch (error) {
      console.log("Error during updating user's new password: ", error);
    }
  };

  return (
    <>
      <div className="container mx-auto mt-10 max-w-md p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Edit Profil</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-gray-700">
              Kata Sandi Saat Ini
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-gray-700">
              Kata Sandi Baru
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-gray-700">
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full"
          >
            Perbarui Kata Sandi
          </button>
        </form>
        {message && (
          <p className="mt-4 text-green-700 text-center">{message}</p>
        )}

        <div className="mt-3">
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
        </div>
      </div>
    </>
  );
}
