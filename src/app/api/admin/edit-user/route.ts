import User from "@/models/User";
import connectMongoDB from "@/util/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface UpdateUser {
  username: string;
  password?: string;
  regional: string;
  role: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { username, password, regional, role, editId } = await req.json();

    // const updatedUser = await User.findByIdAndUpdate(editId, {
    //   username,
    //   password,
    //   regional,
    //   role,
    // });

    const updatedData: UpdateUser = {
      username,
      regional,
      role,
    };

    if (password !== undefined && password !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(editId, updatedData);

    if (updatedUser) {
      return NextResponse.json(
        { message: `User ${username} telah diperbarui.` },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Gagal memperbarui user. User tidak ditemukan." },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan dalam memperbarui user." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectMongoDB();
    const { username, id } = await req.json();

    const deletedUser = await User.findByIdAndRemove(id);

    if (deletedUser) {
      return NextResponse.json(
        { message: `User ${username} telah dihapus.` },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Gagal menghapus user. User tidak ditemukan." },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan dalam menghapus user." },
      { status: 500 }
    );
  }
}
