import connectMongoDB from "@/util/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Device from "@/models/Device";
import History from "@/models/History";
import watermark from "@/util/watermark";
import dateTime from "@/util/dateTime";

export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const session = await getServerSession(authOptions);
    const regional = session?.user.regional;
    const userId = session?.user.id;

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
    for (let i = 0; i < data.images.length; i++) {
      const base64 = await watermark(
        Buffer.from(data.images[i].split(",")[1], "base64"),
        {
          sn: data.sn,
          datetime: dateTime(),
          location: data.location,
        }
      );
      console.log(base64);
      images.push(Buffer.from(base64, "base64"));
    }

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

    return NextResponse.json({ message: "Device changed to valid" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        // message: "An error occured while updating device.",
        message: String(error),
      },
      {
        status: 500,
      }
    );
  }
}
