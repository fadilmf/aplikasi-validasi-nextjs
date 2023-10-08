"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [autoDisableDays, setAutoDisableDays] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAutoDisableDaysChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const days = parseInt(e.target.value, 10);
    setAutoDisableDays(days);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          autoDisableDays,
        }),
      });
    } catch (error) {
      console.log("Error during registration: ", error);
    }

    // Tampilkan pesan sukses
    setSuccessMessage("Pengaturan berhasil disimpan.");
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md mb-4">
            {successMessage}
          </div>
        )}
        <div className="mb-4">
          <p className="text-gray-700">
            Saat ini, device akan otomatis tidak valid dalam{" "}
            <strong>30 Hari</strong>.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">
              Update device akan otomatis tidak valid dalam:
            </label>
            <div className="flex items-center gap-2 mt-1 border rounded">
              <input
                type="number"
                name="autoDisableDays"
                value={autoDisableDays}
                onChange={handleAutoDisableDaysChange}
                className="w-full p-2 rounded"
                min="1"
                required
              />
              <div className="bg-slate-300 p-2 rounded-r-md">
                <p>Hari</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
