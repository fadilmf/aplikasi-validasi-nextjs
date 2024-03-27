import Device from "@/models/Device";
import connectMongoDB from "@/util/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const regionalParam = Number(req.nextUrl.searchParams.get("regional"));
    const witelParam = req.nextUrl.searchParams.get("witel");

    let devices;

    if (regionalParam === 0) {
      devices = await Device.find({}, { _id: 0 });
    } else if (witelParam == "all") {
      devices = await Device.find({
        regional: regionalParam,
      });
    } else {
      devices = await Device.find({
        regional: regionalParam,
        witel: witelParam,
      });
    }

    return NextResponse.json({ devices }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan dalam mengambil data perangkat." },
      { status: 500 }
    );
  }
}
