import connectMongoDB from "@/util/mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    const username = session?.user.username;
    const user = await User.findOne({ username });

    const { currentPassword, newPassword } = await req.json();

    console.log("currentPassword server: ", currentPassword);
    console.log("newPassword server: ", newPassword);

    if (!user || !currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Missing user or password data." },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Current password is incorrect." },
        { status: 400 }
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while updating the password." },
      { status: 500 }
    );
  }
}
