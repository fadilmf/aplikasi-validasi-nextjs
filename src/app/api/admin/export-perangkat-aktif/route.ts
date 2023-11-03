import Device from "@/models/Device";
import connectMongoDB from "@/util/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const devices = await Device.find({}, { _id: 0 });

    return NextResponse.json({ devices }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan dalam mengambil data perangkat." },
      { status: 500 }
    );
  }
}
