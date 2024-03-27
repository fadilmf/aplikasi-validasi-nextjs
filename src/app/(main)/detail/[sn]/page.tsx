"use client";

import Loading from "@/components/Loading";
import History from "@/types/History";
import dateTime from "@/util/dateTime";
import checkLastDate from "@/util/lastDate";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Detail() {
  const [showButtons, setShowButtons] = useState(false);
  // const [device, setDevice] = useState<any[]>([]);
  const [device, setDevice] = useState<any>();
  const [images, setImages] = useState<string[]>([]);
  const [histories, setHistories] = useState<History[]>([]);
  const [daysAutoNotValid, setDaysAutoNotValid] = useState(0);
  const [lastDate, setLastDate] = useState<any>();
  const [loading, setLoading] = useState(true);

  const [errorPageMessage, setErrorPageMessage] = useState("");

  const params = useParams();

  const { data: session } = useSession();
  const viewer = session?.user.role === "viewer";

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
    const res = await fetch("/api/devices/detail?sn=" + params.sn);
    const data = await res.json();
    if (data.status != 200) {
      setErrorPageMessage(data.message);
    }
    return data;
  };

  useEffect(() => {
    setLoading(true);
    fetchDevices().then((data) => {
      setDevice(data.device);
      // const lastValidDate = data.device.validAt;
      const lastValidDate = checkLastDate(data.device);
      setLastDate(lastValidDate);

      const msSinceValid =
        new Date().getTime() - new Date(lastValidDate).getTime();
      let daysSinceValid = Math.floor(msSinceValid / 1000 / 86400);
      setDaysAutoNotValid(data.expirationDays - daysSinceValid);
      fetchHistory().then((histories) => {
        setHistories(histories);
        setLoading(false);
      });
    });
  }, []);

  if (errorPageMessage)
    return (
      <>
        <h1>{errorPageMessage}</h1>
      </>
    );
  else if (loading) return <Loading loading={loading} />;
  else
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
                    {device?.sn}
                  </div>
                </h1>
                <p>Merk: {device?.merk}</p>
                <p>Status: {device?.isValid ? "Valid" : "Tidak Valid"}</p>
                {device?.isValid && (
                  <p>Last Validasi: {dateTime(new Date(lastDate))}</p>
                )}
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
                <p className="capitalize">{device?.witel}</p>
                <p>Use:</p>
                <p>{device?.use}</p>
                <p>NIK:</p>
                <p>{device?.nik}</p>
                <p>Nama:</p>
                <p>{device?.nama}</p>
                <p>No. Telp:</p>
                <p>{device?.telp}</p>
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
          {!viewer && (
            <div>
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
              <div className="my-5">
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
            </div>
          )}
          {device?.isValid && (
            <div className="flex justify-center text-center w-full">
              {/* <h1>Device valid selama {daysSinceValid} hari</h1> */}
              <h1>Device akan tidak valid dalam {daysAutoNotValid} hari</h1>
            </div>
          )}
          {histories?.length > 0 && (
            <div className="mt-5">
              <h1 className="flex justify-center font-medium text-lg mb-3">
                Validasi History:
              </h1>
              <ol className="list-decimal list-inside">
                {histories.map((history, index) => (
                  <li key={index}>
                    <Link href={`${params.sn}/${history._id}`}>
                      {dateTime(new Date(history?.createdAt))} <span>by</span>{" "}
                      {history?.user?.username}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </>
    );
}
