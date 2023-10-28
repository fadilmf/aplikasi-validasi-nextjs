"use client";

import PaginationBar from "@/components/PaginationBar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdFilterList, MdSearch } from "react-icons/md";
import Loading from "@/components/Loading";

export default function Search() {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deviceList, setDevicesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // const router = useRouter();

  const params = useSearchParams();
  const status = params.get("isValid");

  const handleFilterClick = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const handleSearch = async () => {
    const devices = await fetchDevices(searchTerm);
    console.log("devices", devices);
    setDevicesList(devices.devices);
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
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    setLoading(true);
    fetchDevices().then((data) => {
      setDevicesList(data.devices);
      setLoading(false);
      setPageCount(data.pagination.pageCount);
    });
  }, [page]);

  if (loading) return <Loading loading={loading} />;
  else
    return (
      <>
        <div className="container mx-auto p-4 mb-16">
          <div className="w-full flex rounded-lg">
            <div className="flex items-center">
              <button
                onClick={handleFilterClick}
                className="bg-gray-100 p-3 rounded-l-full border border-gray-300"
              >
                <MdFilterList className="text-3xl text-gray-300" />
              </button>
            </div>
            <input
              type="text"
              className="w-full py-2 px-4 border border-gray-300 focus:ring-green-500 focus:border-green-500"
              placeholder="Cari perangkat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center">
              <button
                onClick={handleSearch}
                className="bg-green-800 p-3 rounded-r-full"
              >
                <MdSearch className="text-3xl text-white" />
              </button>
            </div>
          </div>

          {isFilterMenuOpen && (
            <div className="mt-2 p-4 bg-white rounded shadow-lg border border-gray-300">
              <div className="flex space-x-4">
                <div>
                  <label htmlFor="regional" className="text-gray-600 block">
                    Regional:
                  </label>
                  <select
                    id="regional"
                    name="regional"
                    className="p-2 border rounded w-36"
                  >
                    <option value="Semua Regional">Semua Regional</option>
                    <option value="Regional 1">Regional 1</option>
                    <option value="Regional 2">Regional 2</option>
                    <option value="Regional 3">Regional 3</option>
                    <option value="Regional 4">Regional 4</option>
                    {/* Tambahkan pilihan Regional 5 hingga 8 di sini */}
                  </select>
                </div>
                <div>
                  <label htmlFor="witel" className="text-gray-600 block">
                    Witel:
                  </label>
                  <select
                    id="witel"
                    name="witel"
                    className="p-2 border rounded w-36"
                  >
                    <option value="Semua Witel">Semua Witel</option>
                    {/* Tambahkan pilihan Witel sesuai kebutuhan di sini */}
                  </select>
                </div>
              </div>
              <div className="text-right mt-4">
                <button
                  onClick={handleSearch}
                  className="bg-green-800 p-3 rounded text-white"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-4 mb-4">
            <div>
              <ul className="inline-flex -space-x-px items-center gap-2 text-sm">
                <li>
                  <button
                    disabled={page === 1}
                    onClick={handlePrevious}
                    className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 "
                  >
                    Previous
                  </button>
                </li>
                <li>
                  <div className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300">
                    {page} of {pageCount}
                  </div>
                </li>
                <li>
                  <button
                    disabled={page === pageCount}
                    onClick={handleNext}
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 "
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 mt-3">
            {deviceList.length < 1 && (
              <div className="text-center">
                <h1>Device tidak ada</h1>
              </div>
            )}
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
