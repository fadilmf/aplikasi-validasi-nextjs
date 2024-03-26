import Device from "@/models/Device";
import Setting from "@/models/Setting";
import connectMongoDB from "@/util/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const settings = await Setting.find();

    const expirationDays = settings[0].expiration_days;

    let now = new Date();
    now = new Date(now.setDate(now.getDate() - expirationDays));
    await Device.updateMany(
      {
        isValid: { $eq: true },
        validAt: { $exists: false },
      },
      [
        {
          $set: { validAt: "$createdAt" },
        },
      ]
    );
    await Device.updateMany(
      {
        isValid: { $eq: true },
        validAt: { $lte: now },
      },
      { isValid: false }
    );

    return NextResponse.json({
      message: "Update status valid device berhasil",
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Internal server error",
      status: 500,
    });
  }
}
