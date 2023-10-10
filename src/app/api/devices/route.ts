import Device from "@/models/Device";
import connectMongoDB from "@/util/mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    const regional = session?.user.regional;

    const query: { [k: string]: any } = {};

    const sn = req.nextUrl.searchParams.get("sn");
    const isValid = req.nextUrl.searchParams.get("isValid");
    const search = req.nextUrl.searchParams.get("search");

    if (sn) query.sn = sn;
    if (regional !== 0) query.regional = regional;
    if (isValid) query.isValid = isValid;
    if (search) {
      if (!isNaN(Number(search)))
        query.$expr = {
          $or: [
            {
              $regexMatch: {
                input: { $toString: "$sn" },
                regex: new RegExp(search),
              },
            },
            {
              $regexMatch: {
                input: { $toString: "$csm" },
                regex: new RegExp(search),
              },
            },
            {
              $regexMatch: {
                input: { $toString: "$nik" },
                regex: new RegExp(search),
              },
            },
            {
              $regexMatch: {
                input: { $toString: "$telp" },
                regex: new RegExp(search),
              },
            },
          ],
        };
      else
        query.$or = [
          { perangkat: { $regex: search, $options: "i" } },
          { jenis: { $regex: search, $options: "i" } },
          { nama: { $regex: search, $options: "i" } },
        ];
    }

    console.log(query);

    const devices = await Device.find(query);

    const newDevices = [];

    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];
      if (device.isValid && typeof device.validAt != "undefined") {
        console.log("masuk");
        const validAt = device.validAt;
        validAt.setDate(validAt.getDate() + 30);
        if (validAt <= new Date()) {
          console.log("tidak valid");
          await Device.findOneAndUpdate(device._id, {
            isValid: false,
            validAt: null,
          });
          newDevices.push({ ...device._doc, isValid: false, validAt: null });
        } else {
          newDevices.push(device);
        }
      } else {
        newDevices.push(device);
      }
    }

    return NextResponse.json({
      devices: newDevices,
    });
  } catch (error) {
    console.log(error);
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
