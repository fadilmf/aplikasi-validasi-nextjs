import User from "@/models/User";
import connectMongoDB from "@/util/mongodb";
import { NextRequest, NextResponse } from "next/server";

interface UpdateUser {
  username: string;
  password?: string;
  regional: string;
  role: string;
}

export default async function POST(req: NextRequest) {
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
      updatedData.password = password;
    }

    const updatedUser = await User.findByIdAndUpdate(editId, updatedData);

    if (updatedUser) {
      return NextResponse.json(
        { message: `User dengan ID ${editId} telah diperbarui.` },
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
