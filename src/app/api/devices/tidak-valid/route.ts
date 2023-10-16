import Device from "@/models/Device";
import connectMongoDB from "@/util/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const session = await getServerSession(authOptions);
    const regional = session?.user.regional;

    const data = await req.json();
    const device = await Device.findOne({ sn: data.sn });

    if (regional != 0 && device.regional != regional)
      return NextResponse.json(
        {
          message: "Invalid regional",
        },
        {
          status: 400,
        }
      );

    await Device.findOneAndUpdate(
      { sn: data.sn },
      { notes: data.notes, isValid: false }
    );

    return NextResponse.json({ message: "Device changed to not valid" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "An error occured while updating device.",
      },
      {
        status: 500,
      }
    );
  }
}
