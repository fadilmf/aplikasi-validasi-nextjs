import connectMongoDB from "@/util/mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import History from "@/models/History";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    const regional = session?.user.regional;

    const sn = req.nextUrl.searchParams.get("sn");

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
    const history = await History.find({ device_sn: sn })
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
