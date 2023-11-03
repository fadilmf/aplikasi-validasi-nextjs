"use client";

import Loading from "@/components/Loading";
import { downloadCsv } from "@/util/downloadCsv";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdDownload } from "react-icons/md";

export default function Home() {
  const [activeDevices, setActiveDevices] = useState(0);
  const [validDevices, setValidDevices] = useState(0);
  const [invalidDevices, setInvalidDevices] = useState(0);
  const [loading, setLoading] = useState(true);

  const [regional, setRegional] = useState(0);
  const [witel, setWitel] = useState("all");

  const fetchDevices = async (reg?: number, wit?: string) => {
    let url = "/api/devices?homeCount=true";
    if (reg) url += "&regional=" + reg;
    if (wit) url += "&witel=" + wit;
    const res = await fetch(url);
    const json = await res.json();
    const devices = json.devices;
    setActiveDevices(devices.total);
    setValidDevices(devices.valid);
    setInvalidDevices(devices.invalid);
    setLoading(false);
  };

  const changeRegional = (reg: number) => {
    setLoading(true);
    setRegional(reg);
    fetchDevices(reg, witel);
  };

  const changeWitel = (wit: string) => {
    setLoading(true);
    setWitel(wit);
    fetchDevices(regional, wit);
  };

  const { data: session } = useSession();

  const handleExportCSV = async () => {
    try {
      const res = await fetch("api/admin/export-perangkat-aktif");
      const data = await res.json();

      if (data.devices) {
        downloadCsv(data.devices, "perangkat-aktif");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data perangkat.", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (session) {
      setRegional(session!!.user.regional);
    }
    fetchDevices();
  }, [session]);

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
                value={regional}
                onChange={(e) => {
                  changeRegional(Number(e.target.value));
                }}
                className="p-2 border rounded"
                disabled={session?.user?.regional !== 0}
              >
                <option value={0}>Semua Regional</option>
                <option value={1}>Regional 1</option>
                <option value={2}>Regional 2</option>
                <option value={3}>Regional 3</option>
                <option value={4}>Regional 4</option>
                <option value={5}>Regional 5</option>
                <option value={6}>Regional 6</option>
                <option value={7}>Regional 7</option>
                <option value={8}>Regional 8</option>
              </select>
            </div>

            {/* Dropdown Witel */}
            <div>
              <label htmlFor="witel" className="text-gray-600 block">
                Witel:
              </label>
              <select
                id="witel"
                name="witel"
                className="p-2 border rounded"
                value={witel}
                onChange={(e) => changeWitel(e.target.value)}
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
            </div>
          </div>

          <div className="py-3">
            <button
              onClick={handleExportCSV}
              className="flex gap-2 items-center bg-green-500 text-white p-2 rounded-md"
            >
              <MdDownload />
              Export Data Perangkat Aktif
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Card Perangkat Aktif */}
            <Link
              href={
                "/validasi?" +
                `&regional=${regional ? regional : "0"}` +
                `&witel=${witel ? witel : "all"}`
              }
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
              href={
                "/validasi?isValid=true" +
                `&regional=${regional ? regional : "0"}` +
                `&witel=${witel ? witel : "all"}`
              }
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
              href={
                "/validasi?isValid=false" +
                `&regional=${regional ? regional : "0"}` +
                `&witel=${witel ? witel : "all"}`
              }
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
