"use client";

import PaginationBar from "@/components/PaginationBar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdFilterList, MdSearch } from "react-icons/md";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import witelList from "@/util/witel.json";
import { format } from "url";

export default function Search() {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deviceList, setDevicesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const [regional, setRegional] = useState(0);
  const [witel, setWitel] = useState("all");
  const [status, setStatus] = useState("");

  const router = useRouter();
  const { data: session } = useSession();

  const params = useSearchParams();
  const statusParams = params.get("isValid");
  const regionalParams = params.get("regional");
  const witelParams = params.get("witel");

  const handleFilterClick = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const handleSearch = async () => {
    const devices = await fetchDevices(searchTerm, regional, witel);
    setDevicesList(devices.devices);
  };

  const fetchDevices = async (
    search?: string,
    reg?: number,
    wit?: string,
    stat?: string
  ) => {
    const queryParams = new URLSearchParams();

    if (search) {
      queryParams.append("search", search);
    }
    if (reg && reg !== 0) {
      queryParams.append("regional", reg.toString());
    }

    if (wit) {
      queryParams.append("witel", wit);
    } else {
      queryParams.append("witel", "all");
    }

    if (stat) {
      queryParams.append("isValid", stat);
    }

    // const res = await fetch(
    //   `/api/devices?page=${page}${status ? "&isValid=" + status : ""}${
    //     search ? "&search=" + search : ""
    //   }${reg && reg != 0 ? "&regional=" + reg : ""}${
    //     wit ? "&witel=" + wit : ""
    //   }`
    // );
    const res = await fetch(
      `/api/devices?page=${page}&${queryParams.toString()}`
    );
    const data = await res.json();
    setPageCount(data.pagination.pageCount);

    // router.push("/validasi");
    router.push(
      format({
        pathname: "/validasi",
        query: queryParams.toString(),
      })
    );

    return data;
  };

  const handlePrevious = () => {
    setPage((p) => {
      if (p === 1) return p;
      const newPage = p - 1;
      const url = format({ pathname: "/validasi", query: { page: newPage } });
      router.push(url);
      return newPage;
    });
  };

  const handleNext = () => {
    setPage((p) => {
      if (p === pageCount) return p;
      const newPage = p + 1;
      const url = format({ pathname: "/validasi", query: { page: newPage } });
      router.push(url);
      return newPage;
    });
  };

  const changeRegional = async (reg: number) => {
    setLoading(true);
    setRegional(reg);
    setWitel("all");
    setPage(1);
    const devices = await fetchDevices(searchTerm, reg, "all", status);
    setDevicesList(devices.devices);
    setLoading(false);
  };

  const changeWitel = async (wit: string) => {
    setLoading(true);
    setWitel(wit);
    setPage(1);
    const devices = await fetchDevices(searchTerm, regional, wit, status);
    setDevicesList(devices.devices);
    setLoading(false);
  };

  const changeStatus = async (stat: string) => {
    setLoading(true);
    setStatus(stat);
    setPage(1);
    const devices = await fetchDevices(searchTerm, regional, witel, stat);
    setDevicesList(devices.devices);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    // if (session) {
    //   setRegional(session!!.user.regional);
    // }
    // setRegional(Number(regionalParams));

    const regionalParam = regionalParams ? Number(regionalParams) : 0;
    const witelParam = witelParams ? witelParams : witel;
    const statusParam = statusParams ? String(statusParams) : "";

    setRegional(regionalParam);
    setWitel(witelParam);
    setStatus(statusParam);

    console.log("regionalParams: ", regionalParams);
    console.log("witelParamsss : ", witelParams);
    console.log("statusParams : ", statusParams);
    console.log("regional: ", regional);
    console.log("witel: ", witel);

    fetchDevices(undefined, regionalParam, witelParam, statusParam).then(
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
                    disabled={session?.user?.regional !== 0}
                  >
                    <option value={0}>All Regional</option>
                    {Object.keys(witelList).map((reg, i) => (
                      <option key={i} value={reg}>
                        Regional {reg}
                      </option>
                    ))}
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
                    {regional != 0 &&
                      (witelList as any)[regional].map(
                        (wit: string, i: number) => (
                          <option key={i} value={wit}>
                            {wit}
                          </option>
                        )
                      )}
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="text-gray-600 block">
                    Status:
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) => changeStatus(e.target.value)}
                    className="p-2 border rounded w-36"
                  >
                    <option value="">All Status</option>
                    <option value="true">Valid</option>
                    <option value="false">Tidak Valid</option>
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
