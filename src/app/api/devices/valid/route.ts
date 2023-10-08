import connectMongoDB from "@/util/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Device from "@/models/Device";
import IDevice from "@/types/IDevice";
import History from "@/models/History";

export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const session = await getServerSession(authOptions);
    const regional = session?.user.regional;
    const userId = session?.user.id;

    console.log("ini userid: ", userId);

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
      { notes: data.notes, isValid: true, validAt: new Date() }
    );

    const images: Buffer[] = [];
    data.images.forEach((image: string) => {
      images.push(Buffer.from(image, "base64"));
    });

    if (images.length <= 0)
      return NextResponse.json(
        {
          message: "Minimum 1 image required",
        },
        {
          status: 400,
        }
      );

    await History.create({
      user: userId,
      device_sn: device.sn,
      images,
      notes: data.notes,
      location: data.location,
    });

    return NextResponse.json({ message: "Device changed" });
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
