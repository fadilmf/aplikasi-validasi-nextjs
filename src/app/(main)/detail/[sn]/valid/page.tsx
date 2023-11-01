"use client";

import Loading from "@/components/Loading";
import dateTime from "@/util/dateTime";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { createRef, useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";

export default function ValidPage() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [locationPermission, setLocationPermission] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = useParams();

  const imageElements = () => {
    const el = [];
    for (let i = 0; i < 3 - images.length; i++) {
      el.push(
        <div>
          <Image
            key={i}
            className="self-center relative"
            src="/img/img_perangkat_aktif.svg"
            alt={""}
            width={300}
            height={300}
          />
        </div>
      );
    }
    return el;
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (images.length >= 3) return;
    const file = e.target?.files!![0];
    console.log("handleImage", file);
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      console.log("image added");
      const image = e.target?.result as string;
      const newImages = images;
      newImages.push(image);
      setImages(newImages);
    };
    fileReader.readAsDataURL(file);
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleRemoveImage = (i: number) => {
    const newImages = images;
    newImages.splice(i, 1);
    setImages(newImages);
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        console.log(result);
        if (result.state !== "denied") {
          setLocationPermission(true);
          setLoading(true);
          navigator.geolocation.getCurrentPosition(
            (position) => {
              fetchLocation(
                position.coords.latitude,
                position.coords.longitude
              ).then((location) => {
                setLocation(location);
                setLoading(false);
              });
            },
            (error) => {
              if (error.code === 1) {
                alert("Aktifkan izin akses lokasi untuk validasi perangkat.");
              }
            }
          );
        } else {
          // Izin ditolak
          setLocationPermission(false);
        }
      });
    } else {
      alert("Geolocation tidak didukung di perangkat Anda.");
    }
  };

  useEffect(() => {
    // getLocation();

    const updateDate = () => {
      setDate(dateTime());
    };

    const intervalId = setInterval(updateDate, 1000);

    // Setel ulang izin setiap kali komponen dimuat
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchLocation(position.coords.latitude, position.coords.longitude).then(
          (location) => {
            setLocation(location);
            setLoading(false);
          }
        );
      },
      (error) => {
        if (error.code === 1) {
          setLocationPermission(false);
          alert("Aktifkan izin akses lokasi untuk validasi perangkat.");
          setLoading(false);
        }
      }
    );

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchLocation = async (lat: Number, lon: Number) => {
    const res = await fetch("/api/location?lat=" + lat + "&lon=" + lon);
    const location = await res.json();
    return location.data.display_name;
  };

  const handleSubmit = async () => {
    const data = { images, notes, sn: params.sn, location };

    setLoading(true);

    const res = await fetch("/api/devices/valid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.status == 200) {
      return router.push("../" + params.sn);
    } else {
      const json = await res.json();
      setError(json.message);
      setLoading(false);
    }
  };

  if (loading) return <Loading loading={loading} />;
  else
    return (
      <>
        <div className="container mx-auto p-4 mb-20">
          <h1 className="text-center text-2xl font-semibold">
            Perangkat Valid
          </h1>
          {locationPermission === false ? (
            <p>
              Aktifkan izin akses lokasi untuk melanjutkan. (Refresh setelah
              memberi akses)
            </p>
          ) : (
            <div className="flex flex-col mb-3">
              {images.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((image, i) => (
                    <div key={i}>
                      <Image
                        className="self-center relative"
                        src={images[i] ? image : `/img/img_perangkat_aktif.svg`}
                        alt={""}
                        width={300}
                        height={300}
                      />
                      <button
                        className="bg-red-500 p-1 rounded-full text-white absolute -translate-y-10"
                        onClick={() => {
                          handleRemoveImage(i);
                        }}
                      >
                        <MdClose />
                      </button>
                    </div>
                  ))}
                  {imageElements()}
                </div>
              ) : (
                <Image
                  className="self-center"
                  src="/img/img_perangkat_aktif.svg"
                  alt={""}
                  width={300}
                  height={300}
                />
              )}
              <div className="grid grid-cols-2">
                <p>Waktu:</p>
                <p>{date}</p>
                <p>Lokasi:</p>
                <p>{location}</p>
              </div>
              <div className="mb-4">
                <label className="flex bg-green-800 py-2 px-4 rounded-full text-white mt-4">
                  <input
                    className="mt-1"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    multiple
                    capture="environment"
                    hidden
                  />
                  <div className="text-center w-full cursor-pointer">
                    Ambil Gambar
                  </div>
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Notes:
                  <textarea
                    className="mt-1 p-2 border rounded w-full"
                    name=""
                    id=""
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.currentTarget.value)}
                  />
                </label>
              </div>
              {error && (
                <div className="bg-pink-100 border border-pink-700 px-2 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-2 md:flex-row mt-2">
                <button
                  className="bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded-full w-full md:w-auto"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <button
                  className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-full w-full md:w-auto"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
}
