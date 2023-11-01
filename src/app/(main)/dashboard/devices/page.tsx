"use client";

import { useState } from "react";
import Papa from "papaparse";

export default function DevicePage() {
  const [sn, setSn] = useState(0);
  const [merk, setMerk] = useState("");
  const [csm, setCsm] = useState(0);
  const [perangkat, setPerangkat] = useState("");
  const [jenis, setJenis] = useState("");
  const [nama, setNama] = useState("");
  const [regional, setRegional] = useState(0);
  const [witel, setWitel] = useState("");
  const [use, setUse] = useState(0);
  const [nik, setNik] = useState(0);
  const [telp, setTelp] = useState(0);

  const [isInputCSV, setIsInputCSV] = useState(false);

  const [csvData, setCsvData] = useState<any[]>([]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files!![0];

    Papa.parse(file, {
      header: true, // Jika baris pertama adalah header
      dynamicTyping: true, // Otomatis deteksi tipe data
      complete: (result) => {
        // Hasil pemrosesan CSV
        const data = result.data;

        // Lakukan sesuatu dengan data, seperti mengirimnya ke API
        console.log("Data from CSV:", data);

        setCsvData(data);
      },
    });
  };

  const handleCsvSubmit = async () => {
    fetch("/api/admin/devices/csv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ devices: csvData }),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sn,
          merk,
          csm,
          perangkat,
          jenis,
          nama,
          regional,
          witel,
          use,
          nik,
          telp: "62" + telp,
        }),
      });
      console.log(res.body);

      if (res.ok) {
        setSn(0);
        setCsm(0);
        setPerangkat("");
        setJenis("");
        setNama("");
        setRegional(0);
        setUse(0);
        setNik(0);
        setTelp(0);

        setErrorMessage("");
        setSuccessMessage("Device berhasil ditambahkan.");
      } else {
        console.log("Adding device failed");
      }
    } catch (error) {
      console.log("Error during adding device: ", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Add Device</h1>
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
        {isInputCSV && (
          <div className="mb-4">
            <input type="file" accept=".csv" onChange={handleCSVUpload} />
            <div className="mt-3">
              <button
                onClick={handleCsvSubmit}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full"
              >
                Add CSV
              </button>
            </div>
          </div>
        )}
        {!isInputCSV && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Serial Number:</label>
              <input
                type="number"
                name="serialNumber"
                value={sn}
                onChange={(e) => setSn(Number(e.target.value))}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Merk:</label>
              <input
                type="text"
                name="merk"
                value={merk}
                onChange={(e) => setMerk(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">CSM:</label>
              <input
                type="number"
                name="csm"
                value={csm}
                onChange={(e) => setCsm(Number(e.target.value))}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Perangkat:</label>
              <input
                type="text"
                name="perangkat"
                value={perangkat}
                onChange={(e) => setPerangkat(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Jenis:</label>
              <input
                type="text"
                name="jenis"
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nama:</label>
              <input
                type="text"
                name="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Regional:</label>
              <input
                type="number"
                name="regional"
                value={regional}
                onChange={(e) => setRegional(Number(e.target.value))}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Witel:</label>
              <select
                name="witel"
                value={witel}
                className="mt-1 p-2 border rounded w-full"
                onChange={(e) => setWitel(e.target.value)}
              >
                <option value="all">All Witel</option>
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
                <option value="babel">Babel</option>
              </select>
              {/* <input
                type="text"
                name="witel"
                value={witel}
                onChange={(e) => setWitel(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
                required
              /> */}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Device Use:</label>
              <input
                type="number"
                name="deviceUse"
                value={use}
                onChange={(e) => setUse(Number(e.target.value))}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">NIK:</label>
              <input
                type="number"
                name="nik"
                value={nik}
                onChange={(e) => setNik(Number(e.target.value))}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Telepon:</label>
              <div className="flex items-center border rounded-r">
                <span className="bg-slate-200 p-2 rounded-l">+62</span>
                <input
                  type="number"
                  name="telepon"
                  value={telp}
                  onChange={(e) => setTelp(Number(e.target.value))}
                  className="p-2 rounded-r w-full"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full"
              >
                Add Device
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
