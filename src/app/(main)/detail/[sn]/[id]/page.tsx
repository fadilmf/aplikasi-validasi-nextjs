"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HistoryId() {
  const [showButtons, setShowButtons] = useState(false);
  const [device, setDevice] = useState<any[]>([]);
  const [histories, setHistories] = useState([]);

  const params = useParams();
  console.log(params);

  const handleUpdateClick = () => {
    setShowButtons(!showButtons);
  };

  const goBack = () => {
    window.history.back();
  };

  const fetchHistory = async () => {
    const res = await fetch(
      "/api/devices/history?sn=" + params.sn + "&id=" + params.id
    );
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
          </div>
        </div>
        <div className="mt-5">
          <div className={`grid grid-cols-${histories[0]?.images?.length}`}>
            {histories[0]?.images.map((image, i) => (
              <Image
                key={i}
                src={image}
                alt="Device image"
                width={200}
                height={200}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
