import User from "@/models/User";
import connectMongoDB from "@/util/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password, regional, witel, role } = await req.json();
    await connectMongoDB();

    const user = await User.findOne({ username }).select("_id");
    if (user)
      return NextResponse.json(
        {
          message: "Username telah digunakan",
        },
        {
          status: 406,
        }
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      password: hashedPassword,
      regional,
      witel,
      role,
    });
    return NextResponse.json(
      {
        message: "User registered",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occured while registering the user.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectMongoDB();
    const users = await User.find();

    return NextResponse.json({
      users,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occured while fetching users.",
      },
      {
        status: 500,
      }
    );
  }
}
