"use client";

import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [activeDevices, setActiveDevices] = useState(0);
  const [validDevices, setValidDevices] = useState(0);
  const [invalidDevices, setInvalidDevices] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    const res = await fetch("/api/devices?homeCount=true");
    const devices = await res.json();
    return devices.devices;
  };

  useEffect(() => {
    setLoading(true);
    fetchDevices().then(
      (devices: { total: number; valid: number; invalid: number }) => {
        setActiveDevices(devices.total);
        setValidDevices(devices.valid);
        setInvalidDevices(devices.invalid);
        setLoading(false);
      }
    );
  }, []);

  const { data: session } = useSession();

  if (loading) return <Loading loading={loading} />;
  else
    return (
      <>
        <div className="container mx-auto p-4 mb-20">
          <h1 className="text-3xl font-semibold">Selamat Datang!</h1>
          <p className="text-gray-600 mb-4">
            Halo, <span className="font-bold">{session?.user?.username}</span>!
            Berikut adalah informasi perangkat:
          </p>

          <div className="flex space-x-4 mb-4">
            {/* Dropdown Regional */}
            <div>
              <label htmlFor="regional" className="text-gray-600 block">
                Regional:
              </label>
              <select
                id="regional"
                name="regional"
                className="p-2 border rounded"
              >
                <option value="Semua Regional">Semua Regional</option>
                <option value="Regional 1">Regional 1</option>
                <option value="Regional 2">Regional 2</option>
                <option value="Regional 3">Regional 3</option>
                <option value="Regional 4">Regional 4</option>
                {/* Tambahkan pilihan Regional 5 hingga 8 di sini */}
              </select>
            </div>

            {/* Dropdown Witel */}
            <div>
              <label htmlFor="witel" className="text-gray-600 block">
                Witel:
              </label>
              <select id="witel" name="witel" className="p-2 border rounded">
                <option value="">All Witel</option>
                <option value="">Aceh</option>
                <option value="">Medan</option>
                <option value="">Siantar</option>
                <option value="">Batam</option>
                <option value="">Palembang</option>
                <option value="">Jambi</option>
                <option value="">Padang</option>
                <option value="">Pekanbaru</option>
                <option value="">Lampung</option>
                <option value="">Bengkulu</option>
                <option value="">Babel</option>
              </select>
            </div>
          </div>

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
