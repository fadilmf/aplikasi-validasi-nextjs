import Setting from "@/models/Setting";
import connectMongoDB from "@/util/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { autoDisableDays } = await req.json();

    await Setting.findOneAndUpdate(
      { id: 1 },
      { expiration_days: autoDisableDays }
    );
    return NextResponse.json(
      {
        message: "Setting berhasil terupdate",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
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

export async function GET(req?: NextRequest) {
  try {
    await connectMongoDB();
    const settings = await Setting.find();

    return NextResponse.json({
      settings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occured while fetching settings.",
      },
      {
        status: 500,
      }
    );
  }
}
