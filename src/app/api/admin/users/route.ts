import User from "@/models/User";
import connectMongoDB from "@/util/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password, regional, role } = await req.json();
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
    console.log(error);
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
