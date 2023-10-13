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

    query.device_sn = sn;
    if (id) query._id = id;

    console.log(query);

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
