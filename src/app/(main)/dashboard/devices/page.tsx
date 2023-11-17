"use client";

import { useState } from "react";
import Papa from "papaparse";
import witelList from "@/util/witel.json";

export default function DevicePage() {
  const [sn, setSn] = useState("");
  const [merk, setMerk] = useState("");
  const [csm, setCsm] = useState("");
  const [perangkat, setPerangkat] = useState("");
  const [jenis, setJenis] = useState("");
  const [nama, setNama] = useState("");
  const [regional, setRegional] = useState(0);
  const [witel, setWitel] = useState("");
  const [use, setUse] = useState("");
  const [nik, setNik] = useState(0);
  const [telp, setTelp] = useState(0);

  const [isInputCSV, setIsInputCSV] = useState(false);

  const [csvData, setCsvData] = useState<any[]>([]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [failedDevices, setFailedDevices] = useState<any[]>([]);
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
      complete: (result) => {
        const data = result.data;

        setCsvData(data);
      },
    });
  };

  const handleCsvSubmit = async () => {
    setIsBtnLoading(true);
    const res = await fetch("/api/admin/devices/csv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ devices: csvData }),
    });

    const json = await res.json();

    if (res.ok) {
      setSuccessMessage(json.message);
      setErrorMessage(json.failed.length + " devices gagal ditambahkan");

      setFailedDevices(json.failed);
    } else {
      setErrorMessage(json.message);
    }
    setIsBtnLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBtnLoading(true);
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
          telp: Number("62" + telp),
        }),
      });

      if (res.ok) {
        setSn("");
        setCsm("");
        setPerangkat("");
        setJenis("");
        setNama("");
        setMerk("");
        setRegional(0);
        setUse("");
        setNik(0);
        setTelp(0);

        setErrorMessage("");
        setSuccessMessage("Device berhasil ditambahkan.");
      } else {
        setErrorMessage("Device gagal ditambahkan");
        setSuccessMessage("");
      }
    } catch (error) {
      console.log("Error during adding device: ", error);
    }
    setIsBtnLoading(false);
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
        {failedDevices.length > 0 && (
          <>
            <div className="mb-3">
              <button
                onClick={() => setIsFailedMenuOpen(!isFailedMenuOpen)}
                className="bg-slate-500 hover:bg-slate-600 text-white py-2 px-4 rounded-full"
              >
                Lihat {failedDevices.length} devices yang gagal
              </button>
            </div>
            {isFailedMenuOpen && (
              <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-screen-md">
                  {failedDevices.map((device, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-md shadow-md"
                    >
                      <p className="font-bold text-gray-800">
                        Serial Number: {device.sn}
                      </p>
                      <p className="text-red-500">
                        Gagal diupload: {device.error}
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
              <label className="block text-gray-700">Serial Number:</label>
              <input
                type="text"
                name="serialNumber"
                value={sn}
                onChange={(e) => setSn(e.target.value)}
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
                type="text"
                name="csm"
                value={csm}
                onChange={(e) => setCsm(e.target.value)}
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
              <select
                name="regional"
                value={regional}
                onChange={(e) => changeRegional(Number(e.target.value))}
                className="mt-1 p-2 border rounded w-full"
                required
              >
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
              <label className="block text-gray-700">Device Use:</label>
              <input
                type="text"
                name="deviceUse"
                value={use}
                onChange={(e) => setUse(e.target.value)}
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
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full disabled:opacity-25 transition-opacity"
                disabled={isBtnLoading}
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
