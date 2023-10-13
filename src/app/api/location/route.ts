import connectMongoDB from "@/util/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const lat = req.nextUrl.searchParams.get("lat");
    const lon = req.nextUrl.searchParams.get("lon");
    const key = process.env.location_api_key;

    const res = await fetch(
      `https://us1.locationiq.com/v1/reverse?key=${key}&lat=${lat}&lon=${lon}&format=json`
    );

    const data = await res.json();

    return NextResponse.json(
      {
        data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "An error occured while getting location.",
      },
      {
        status: 500,
      }
    );
  }
}
