import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !["aktif", "nonaktif"].includes(status)) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // Ambil dulu data jabatan (termasuk nik)
    const jabatan = await prisma.jabatan.findUnique({
      where: { id: Number(id) },
    });

    if (!jabatan) {
      return NextResponse.json({ message: "Jabatan tidak ditemukan" }, { status: 404 });
    }

    // Update status jabatan
    const updatedJabatan = await prisma.jabatan.update({
      where: { id: Number(id) },
      data: {
        status,
        updated_at: new Date(),
      },
    });

    // Kalau status nonaktif, update role user jadi warga (role_id=4)
    if (status === "nonaktif") {
      await prisma.user.update({
        where: { nik: jabatan.nik },
        data: { role_id: 4 },
      });
    }

    return NextResponse.json({ message: "Status updated", data: updatedJabatan });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json({ message: "Server error", error: String(error) }, { status: 500 });
  }
}