import Device from "@/models/Device";
import connectMongoDB from "@/util/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { devices } = await req.json();
    await connectMongoDB();

    const failed = [];
    for (let i = 0; i < devices.length; i++) {
      const {
        sn,
        merk,
        csm,
        perangkat,
        jenis,
        nama,
        regional,
        use,
        nik,
        telp,
        isValid,
      } = devices[i];
      try {
        await Device.create({
          sn,
          merk,
          csm,
          perangkat,
          jenis,
          nama,
          regional,
          use,
          nik,
          telp,
          isValid,
        });
      } catch (e) {
        failed.push(sn);
      }
    }

    return NextResponse.json({
      message: devices.length - failed.length + " devices berhasil ditambahkan",
      failed,
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
