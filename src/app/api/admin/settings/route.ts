import Setting from "@/models/Setting";
import connectMongoDB from "@/util/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { autoDisableDays } = await req.json();
    console.log(autoDisableDays);

    await Setting.create({ autoDisableDays });
    return NextResponse.json(
      {
        message: "Setting berhasil terupdate",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "An error occured while updating settings.",
      },
      {
        status: 500,
      }
    );
  }
}
