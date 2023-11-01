import Device from "@/models/Device";
import connectMongoDB from "@/util/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      sn,
      merk,
      csm,
      perangkat,
      jenis,
      nama,
      regional,
      witel,
      use,
      nik,
      telp,
      isValid,
    } = await req.json();
    await connectMongoDB();
    await Device.create({
      sn,
      merk,
      csm,
      perangkat,
      jenis,
      nama,
      regional,
      witel,
      use,
      nik,
      telp,
      isValid,
    });
    return NextResponse.json({
      message: "Device berhasil ditambahkan",
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "An error occured while adding new device.",
      },
      {
        status: 500,
      }
    );
  }
}
