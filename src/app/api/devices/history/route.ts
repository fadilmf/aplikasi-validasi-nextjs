import connectMongoDB from "@/util/mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import History from "@/models/History";
import Device from "@/models/Device";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    const userRegional = session?.user.regional;

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

    const sn = req.nextUrl.searchParams.get("sn");
    const id = req.nextUrl.searchParams.get("id");

    const query: { [k: string]: any } = {};

    if (!sn) {
      return NextResponse.json(
        {
          message: "SN is required.",
        },
        {
          status: 400,
        }
      );
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

    query.device_sn = sn;
    if (id) query._id = id;

    const history = await History.find(query)
      .populate("user", "username")
      .exec();

    if (!history) {
      return NextResponse.json(
        {
          message: "History not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (history.length == 1) {
      const images: string[] = [];

      history[0].images?.forEach((image: Buffer) => {
        const base64 = image
          .toString("base64")
          .replace("dataimage", "data:image")
          .replace("base64", ";base64,");
        images.push(base64);
      });

      return NextResponse.json({
        history: [{ ...history[0]._doc, images }],
      });
    } else
      return NextResponse.json({
        history,
      });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred while getting history data.",
      },
      {
        status: 500,
      }
    );
  }
}
