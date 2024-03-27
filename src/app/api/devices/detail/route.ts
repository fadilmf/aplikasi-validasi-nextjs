import connectMongoDB from "@/util/mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Device from "@/models/Device";
import Setting from "@/models/Setting";
import checkLastDate from "@/util/lastDate";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    // const regional = session?.user.regional;

    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Anda tidak terautentikasi.",
        },
        {
          status: 401,
        }
      );
    }

    const userRegional = session.user.regional;

    const sn = req.nextUrl.searchParams.get("sn");

    if (!sn) {
      return NextResponse.json({
        message: "Parameter sn tidak ditemukan.",
      });
    }

    const device = await Device.findOne({ sn });

    if (!device) {
      return NextResponse.json({
        message: "Perangkat dengan SN tersebut tidak ditemukan.",
      });
    }

    if (userRegional !== 0 && device.regional !== userRegional) {
      return NextResponse.json(
        {
          message: "Anda tidak memiliki izin untuk mengakses perangkat ini.",
        },
        {
          status: 403,
        }
      );
    }

    const settings = await Setting.find();

    const expirationDays = settings[0].expiration_days;

    const lastValidDate = checkLastDate(device);
    const msSinceValid =
      new Date().getTime() - new Date(lastValidDate).getTime();
    const daysSinceValid = Math.floor(msSinceValid / 1000 / 86400);

    if (daysSinceValid >= settings[0].expiration_days) {
      device.isValid = false;
      await Device.findOneAndUpdate({ sn }, { isValid: false });
    }

    return NextResponse.json({ device, expirationDays });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occured while getting device data.",
      },
      {
        status: 500,
      }
    );
  }
}
