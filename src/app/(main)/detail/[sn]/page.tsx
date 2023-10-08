"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Detail() {
  const [showButtons, setShowButtons] = useState(false);
  const [device, setDevice] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [histories, setHistories] = useState([]);

  const coba = {
    a: "a",
    b: "b",
  };

  const params = useParams();
  console.log(params);

  const handleUpdateClick = () => {
    setShowButtons(!showButtons);
  };

  const goBack = () => {
    window.history.back();
  };

  const fetchHistory = async () => {
    const res = await fetch("/api/devices/history?sn=" + params.sn);
    const histories = await res.json();
    return histories.history;
  };

  const fetchDevices = async () => {
    const res = await fetch("/api/devices?sn=" + params.sn);
    const devices = await res.json();
    return devices.devices;
  };

  useEffect(() => {
    fetchDevices().then((devices) => {
      console.log("device", devices);
      setDevice(devices);

      const images: string[] = [];

      devices[0].images.forEach((image: { type: string; data: number[] }) => {
        const base64 = btoa(
          // eslint-disable-next-line
          String.fromCharCode.apply(null, new Uint8Array(image.data))
        )
          .replace("dataimage", "data:image")
          .replace("base64", ";base64,");
        images.push(base64);
      });

      setImages(images);
    });

    fetchHistory().then((histories) => {
      console.log("ini histories", histories);
      setHistories(histories);
    });
  }, []);

  return (
    <>
      <div className="container mx-auto p-4 mb-40">
        <div className="mb-4">
          <button onClick={goBack} className="text-blue-500">
            &lt; Kembali
          </button>
        </div>
        <div className="flex flex-wrap">
          <div className="flex flex-row md:flex-col md:w-1/2">
            <div className="w-1/3">
              <Image
                src={"/img/img_perangkat_aktif.svg"}
                alt="Device image"
                width={500}
                height={500}
              />
            </div>
            <div className="w-2/3 pl-4">
              <h1 className="text-2xl font-semibold">
                <div>
                  SN:
                  {device[0]?.sn}
                </div>
              </h1>

              <p>Status: {device[0]?.isValid ? "Valid" : "Tidak Valid"}</p>
              <p>Last Validasi: 16-8-23</p>
            </div>
          </div>
          <div className="mt-3 w-full md:w-1/2">
            <h1 className="font-semibold">Detail</h1>
            <div className="grid grid-cols-2 gap-2">
              <p>CSM:</p>
              <p>{device[0]?.csm}</p>
              <p>Tipe Perangkat:</p>
              <p>{device[0]?.perangkat}</p>
              <p>Jenis Perangkat:</p>
              <p>{device[0]?.jenis}</p>
              <p>Regional:</p>
              <p>{device[0]?.regional}</p>
              <p>Use:</p>
              <p>{device[0]?.use}</p>
              <p>NIK:</p>
              <p>{device[0]?.nik}</p>
              <p>Nama:</p>
              <p>{device[0]?.nama}</p>
              <p>No. Telp:</p>
              <p>{device[0]?.telp}</p>
            </div>
            {/* <div className="grid grid-cols-4 gap-2">
              <p className="col-span-1">
                CSM:
                <hr />
              </p>
              <p className="col-span-3">
                {device.csm}
                <hr />
              </p>
              <p className="col-span-1">Tipe Perangkat:</p>
              <p className="col-span-3">{device.type}</p>
              <p className="col-span-1">Regional:</p>
              <p className="col-span-3">{device.reg}</p>
              <p className="col-span-1">Use:</p>
              <p className="col-span-3">{device.use}</p>
              <p className="col-span-1">Nama:</p>
              <p className="col-span-3">{device.name}</p>
              <p className="col-span-1">No. Telp:</p>
              <p className="col-span-3">{device.telp}</p>
            </div> */}
          </div>
        </div>
        <div className="mt-5">
          <button
            className={`w-full bg-green-700 py-2 rounded-full text-white hover:bg-green-800 ${
              showButtons && "hidden"
            }`}
            onClick={handleUpdateClick}
          >
            Update
          </button>
        </div>
        <div className="mt-5">
          {showButtons && (
            <div className="flex flex-col gap-4">
              <div className="flex text-center space-x-4 ">
                <Link
                  href={params.sn + "/valid"}
                  className="bg-green-800 py-2 px-4 rounded-full w-full text-white hover:bg-green-900"
                >
                  Valid
                </Link>
                <Link
                  href={params.sn + "/tidak-valid"}
                  className="bg-red-500 py-2 px-4 rounded-full w-full text-white hover:bg-red-600"
                >
                  Tidak Valid
                </Link>
              </div>
              <button
                onClick={handleUpdateClick}
                className="bg-white border-2 border-green-800 py-2 px-4 rounded-full text-green-800 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {histories.length > 0 && (
          <div className="mt-5">
            <h1 className="flex justify-center">Validasi History:</h1>
            <ol className="list-decimal list-inside">
              {histories.map((history, index) => (
                <li key={index}>
                  {new Date(history.createdAt).toLocaleString()} <span>by</span>{" "}
                  {history?.user?.username}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}
