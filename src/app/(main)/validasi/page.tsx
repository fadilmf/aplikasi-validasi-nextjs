"use client";

import PaginationBar from "@/components/PaginationBar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";

export default function Search() {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deviceList, setDevicesList] = useState<any[]>([]);

  // const router = useRouter();

  const params = useSearchParams();
  const status = params.get("isValid");

  const handleSearch = async () => {
    const devices = await fetchDevices(searchTerm);
    setDevicesList(devices);
  };

  const handlePrevious = () => {
    setPage((p) => {
      if (p === 1) return p;
      return p - 1;
    });
  };

  const handleNext = () => {
    setPage((p) => {
      if (p === pageCount) return p;
      return p + 1;
    });
  };

  const fetchDevices = async (search?: string) => {
    const res = await fetch(
      `/api/devices?page=${page}${status ? "&isValid=" + status : ""}${
        search ? "&search=" + search : ""
      }`
    );
    const devices = await res.json();
    return devices.devices;
  };

  useEffect(() => {
    fetchDevices().then((devices) => {
      setDevicesList(devices);
    });
  }, []);

  return (
    <>
      <div className="container mx-auto p-4 mb-16">
        <div className="w-full flex rounded-lg">
          <input
            type="text"
            className="w-full py-2 px-4 border border-gray-300 rounded-l-full focus:ring-green-500 focus:border-green-500"
            placeholder="Cari perangkat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className=" flex items-center">
            <button
              onClick={handleSearch}
              className="bg-green-800 p-3 rounded-r-full"
            >
              <MdSearch className="text-3xl text-white" />
            </button>
          </div>
        </div>
        <div className="text-center mt-4 mb-4">
          <PaginationBar />
        </div>
        <div className="grid grid-cols-1 gap-4 mt-3">
          {deviceList.map((result, index) => (
            <Link
              href={"/detail/" + result.sn}
              key={index}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex justify-between">
                <p>SN: {result.sn}</p>
                <p className="font-semibold">
                  {result.isValid ? "Valid" : "Tidak Valid"}
                </p>
              </div>
              <p>Perangkat: {result.perangkat}</p>
              <p>Nama: {result.nama}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
