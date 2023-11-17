"use client";

import History from "@/types/History";
import dateTime from "@/util/dateTime";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HistoryId() {
  const [showButtons, setShowButtons] = useState(false);
  const [device, setDevice] = useState<any>([]);
  const [histories, setHistories] = useState<History[]>([]);

  const params = useParams();

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
    const res = await fetch("/api/devices/detail?sn=" + params.sn);
    const devices = await res.json();
    return devices.device;
  };

  useEffect(() => {
    fetchDevices().then((devices) => {
      setDevice(devices);
    });

    fetchHistory().then((histories) => {
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
                  {histories[0]?.device_sn}
                </div>
              </h1>
              <p>Merk: {device?.merk}</p>
              <p>Status: {device?.isValid ? "Valid" : "Tidak Valid"}</p>
              <p>
                Waktu Validasi: {dateTime(new Date(histories[0]?.createdAt))}
              </p>
            </div>
          </div>
          <div className="mt-3 w-full md:w-1/2">
            <h1 className="font-semibold">Detail</h1>
            <div className="grid grid-cols-2 gap-2">
              <p>CSM:</p>
              <p>{device?.csm}</p>
              <p>Tipe Perangkat:</p>
              <p>{device?.perangkat}</p>
              <p>Jenis Perangkat:</p>
              <p>{device?.jenis}</p>
              <p>Regional:</p>
              <p>{device?.regional}</p>
              <p>Witel:</p>
              <p>{device?.witel}</p>
              <p>Use:</p>
              <p>{device?.use}</p>
              <p>NIK:</p>
              <p>{device?.nik}</p>
              <p>Nama:</p>
              <p>{device?.nama}</p>
              <p>No. Telp:</p>
              <p>{device?.telp}</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          {histories[0]?.notes && (
            <div className="mb-3">
              <h1 className="flex font-medium text-lg">Notes</h1>
              <p className="">{histories[0].notes}</p>
            </div>
          )}
          {histories[0]?.images && (
            <>
              <h1 className="flex font-medium text-lg">Foto</h1>
              <div className={`grid grid-cols-3`}>
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
            </>
          )}
        </div>
      </div>
    </>
  );
}
