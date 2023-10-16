"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function TidakValidPage() {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = useParams();

  const handleCancel = () => {
    window.history.back();
  };

  const handleSubmit = async () => {
    const data = { notes, sn: params.sn };
    setLoading(true);

    const res = await fetch("/api/devices/tidak-valid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.status == 200) {
      return router.push("../" + params.sn);
    } else {
      const json = await res.json();
      setError(json.message);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 mb-20">
        <h1 className="text-center">Perangkat Tidak Valid</h1>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Notes:
            <textarea
              className="mt-1 p-2 border rounded w-full"
              name=""
              id=""
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.currentTarget.value)}
            />
          </label>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <button
            className="bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded-full w-full md:w-auto"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-full w-full md:w-auto"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
