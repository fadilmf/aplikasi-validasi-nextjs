"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [activeDevices, setActiveDevices] = useState(0);
  const [validDevices, setValidDevices] = useState(0);
  const [invalidDevices, setInvalidDevices] = useState(0);

  const fetchDevices = async () => {
    const res = await fetch("/api/devices");
    const devices = await res.json();
    return devices.devices;
  };

  useEffect(() => {
    fetchDevices().then((devices) => {
      setActiveDevices(devices?.length);
      setValidDevices(
        devices?.filter((d: { isValid: boolean }) => d.isValid).length
      );
      setInvalidDevices(
        devices?.filter((d: { isValid: boolean }) => !d.isValid).length
      );
    });
  });

  const { data: session } = useSession();

  return (
    <>
      <div className="container mx-auto p-4 mb-20">
        <h1 className="text-3xl font-semibold">Selamat Datang!</h1>
        <p className="text-gray-600 mb-4">
          Halo, <span className="font-bold">{session?.user?.username}</span>!
          Berikut adalah informasi perangkat:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Card Perangkat Aktif */}
          <Link
            href={"/validasi"}
            className="bg-blue-100 p-4 rounded-lg flex items-center hover:scale-95 transition-transform"
          >
            <Image
              className="mr-4"
              src={"/img/img_perangkat_aktif.svg"}
              alt={"Perangkat Aktif"}
              width={80}
              height={80}
            />
            <div>
              <h2 className="text-blue-500 text-xl font-semibold">
                Perangkat Aktif
              </h2>
              <p className="text-gray-600">Jumlah: {activeDevices}</p>
            </div>
          </Link>
          {/* Card Perangkat Valid */}
          <Link
            href={"/validasi?isValid=true"}
            className="bg-green-100 p-4 rounded-lg flex items-center hover:scale-95 transition-transform"
          >
            <Image
              className="mr-4"
              src={"/img/img_perangkat_valid.svg"}
              alt={"Perangkat Valid"}
              width={80}
              height={80}
            />
            <div>
              <h2 className="text-green-500 text-xl font-semibold">
                Perangkat Valid
              </h2>
              <p className="text-gray-600">Jumlah: {validDevices}</p>
            </div>
          </Link>
          {/* Card Perangkat Tidak Valid */}
          <Link
            href={"/validasi?isValid=false"}
            className="bg-red-100 p-4 rounded-lg flex items-center hover:scale-95 transition-transform"
          >
            <Image
              className="mr-4"
              src={"/img/img_perangkat_tidak_valid.svg"}
              alt={"Perangkat Tidak Valid"}
              width={80}
              height={80}
            />
            <div>
              <h2 className="text-red-500 text-xl font-semibold">
                Perangkat Tidak Valid
              </h2>
              <p className="text-gray-600">Jumlah: {invalidDevices}</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
