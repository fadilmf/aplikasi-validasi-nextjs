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

  const [regional, setRegional] = useState(0);
  const [witel, setWitel] = useState("all");

  // const router = useRouter();

  const params = useSearchParams();
  const status = params.get("isValid");
  const regionalParams = params.get("regional");
  const witelParams = params.get("witel");

  const handleFilterClick = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const handleSearch = async () => {
    const devices = await fetchDevices(searchTerm, regional, witel);
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

  const fetchDevices = async (search?: string, reg?: number, wit?: string) => {
    const res = await fetch(
      `/api/devices?page=${page}${status ? "&isValid=" + status : ""}${
        search ? "&search=" + search : ""
      }${reg && reg != 0 ? "&regional=" + reg : ""}${
        wit ? "&witel=" + wit : ""
      }`
    );
    const data = await res.json();
    setPageCount(data.pagination.pageCount);
    return data;
  };

  const changeRegional = async (reg: number) => {
    setLoading(true);
    setRegional(reg);
    const devices = await fetchDevices(searchTerm, reg, witel);
    setDevicesList(devices.devices);
    setLoading(false);
  };

  const changeWitel = async (wit: string) => {
    setLoading(true);
    setWitel(wit);
    const devices = await fetchDevices(searchTerm, regional, wit);
    setDevicesList(devices.devices);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setRegional(Number(regionalParams));
    setWitel(witelParams ? witelParams : "all");
    fetchDevices(undefined, Number(regionalParams), witelParams!!).then(
      (data) => {
        setDevicesList(data.devices);
        setLoading(false);
        setPageCount(data.pagination.pageCount);
      }
    );
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
            <div className="mt-2 p-4 bg-white rounded border border-gray-300">
              <div className="flex space-x-4">
                <div>
                  <label htmlFor="regional" className="text-gray-600 block">
                    Regional:
                  </label>
                  <select
                    id="regional"
                    name="regional"
                    value={regional}
                    onChange={(e) => changeRegional(Number(e.target.value))}
                    className="p-2 border rounded w-36"
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
                <div>
                  <label htmlFor="witel" className="text-gray-600 block">
                    Witel:
                  </label>
                  <select
                    id="witel"
                    name="witel"
                    value={witel}
                    onChange={(e) => changeWitel(e.target.value)}
                    className="p-2 border rounded w-36"
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
                    disabled={page === pageCount || page > pageCount}
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
