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

    console.log(regional);

    const query: { [k: string]: any } = {};

    const sn = req.nextUrl.searchParams.get("sn");
    const page = req.nextUrl.searchParams.get("page") || 1;
    const isValid = req.nextUrl.searchParams.get("isValid");
    const search = req.nextUrl.searchParams.get("search");
    const homeCount = req.nextUrl.searchParams.get("homeCount");
    const regionalParam = req.nextUrl.searchParams.get("regional");
    const witelParam = req.nextUrl.searchParams.get("witel");

    if (sn) query.sn = sn;
    if (regional !== 0) query.regional = regional;
    else if (regionalParam) {
      query.regional = Number(regionalParam);
    }
    if (witelParam !== "all") {
      query.witel = witelParam;
    }
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

    console.log("query: ", query);
    console.log("regionalParam: ", regionalParam);
    console.log("witelParam: ", witelParam);

    if (!homeCount) {
      const ITEMS_PER_PAGE = 10;

      const skip = (Number(page) - 1) * ITEMS_PER_PAGE;

      const newDevices = [];
      const devices = await Device.find(query).limit(ITEMS_PER_PAGE).skip(skip);

      console.log(devices);
      const count = await Device.count(query);
      for (let i = 0; i < devices.length; i++) {
        const device = devices[i];
        if (device.isValid && typeof device.validAt != "undefined") {
          const validAt = device.validAt;
          validAt.setDate(validAt.getDate() + 30); // TODO: ambil dari database
          if (validAt <= new Date()) {
            console.log("tidak valid");
            await Device.findOneAndUpdate(device._id, {
              isValid: false,
              validAt: null,
            });
            newDevices.push({ ...device._doc, isValid: false, validAt: null });
          } else {
            validAt.setDate(validAt.getDate() - 30); // TODO: ambil dari database
            newDevices.push(device);
          }
        } else {
          newDevices.push(device);
        }
      }

      console.log(newDevices);

      const pageCount = Math.ceil(count / ITEMS_PER_PAGE);

      return NextResponse.json({
        devices: newDevices,
        pagination: {
          count,
          pageCount,
        },
      });
    } else {
      const query: { [k: string]: any } = {};
      if (regional !== 0) query.regional = regional;
      else if (regionalParam) {
        query.regional = Number(regionalParam);
      }
      if (witelParam && witelParam !== "all") {
        query.witel = witelParam;
      }
      const devices = await Device.count(query);
      query.isValid = true;
      const valid = await Device.count(query);

      // const ITEMS_PER_PAGE = 25;
      // const pageCount = devices / ITEMS_PER_PAGE;
      return NextResponse.json({
        devices: {
          total: devices,
          valid,
          invalid: devices - valid,
          // pagination: {
          //   devices,
          //   pageCount,
          // },
        },
      });
    }
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
