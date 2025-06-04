// app/api/user/update-role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const { nik, newRoleId } = await req.json();

    const user = await prisma.user.findUnique({
      where: { nik },
    });

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
    }

    // Update role di tabel user
    await prisma.user.update({
      where: { nik },
      data: {
        role_id: newRoleId,
      },
    });

    // Tambahkan riwayat jabatan baru
    await prisma.jabatan.create({
      data: {
        nik: nik,
        role_id: newRoleId,
        status: "aktif", // ini enum ya, pastikan enum 'jabatan_status' ada isinya 'aktif'
      },
    });

    return NextResponse.json({ message: "Role berhasil diupdate & dicatat di jabatan" });
  } catch (error) {
    console.error("Gagal update role:", error);
    return NextResponse.json({ message: "Gagal update role" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}