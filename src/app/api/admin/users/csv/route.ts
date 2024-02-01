import User from "@/models/User";
import connectMongoDB from "@/util/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { users } = await req.json();
    await connectMongoDB();

    const failed = [];
    for (let i = 0; i < users.length; i++) {
      const { username, password, regional, witel, role } = users[i];

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        failed.push({ username, error: "Username telah digunakan." });
        continue;
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
          username,
          password: hashedPassword,
          regional,
          witel,
          role,
        });
      } catch (e: any) {
        console.error(`Error adding user with ${username}:`, e);
        failed.push({ username, error: e.toString() });
      }
    }

    return NextResponse.json({
      message: users.length - failed.length + " user berhasil ditambahkan",
      failed,
      status: 201,
    });
  } catch (error) {
    console.error("Error handling CSV upload: ", error);
    return NextResponse.json(
      {
        message: "An error occurred while processing the CSV file.",
      },
      {
        status: 500,
      }
    );
  }
}
