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
        witel,
        use,
        nik,
        telp,
        isValid,
      } = devices[i];

      let stringTelp = String(telp);

      const formattedTelp = stringTelp.startsWith("62")
        ? Number(telp)
        : Number(`62` + stringTelp);

      try {
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
          telp: formattedTelp,
          isValid,
        });
      } catch (e: any) {
        console.error(`Error adding device with SN ${sn}:`, e);
        failed.push({ sn, error: e.toString() });
      }
    }

    return NextResponse.json({
      message: devices.length - failed.length + " devices berhasil ditambahkan",
      failed,
      status: 201,
    });
  } catch (error) {
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
