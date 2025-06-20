// app/api/jabatan/list-rt/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.jabatan.findMany({
      orderBy: { created_at: "desc" },
      include: {
        warga: {
          select: {
            nama: true,
            kk: {
              select: {
                rukun_tetangga: {
                  select: {
                    nama: true, // ini akan jadi nama RT
                  },
                },
              },
            },
          },
        },
      },
    });

    const mappedData = data.map((item) => ({
      ...item,
      nama_rt: item.warga?.nama || "-",
      nama_rukun_tetangga: item.warga?.kk?.rukun_tetangga?.nama || "-", // inilah nama RT-nya
    }));

    return NextResponse.json({ data: mappedData });
  } catch (error) {
    console.error("Gagal ambil data jabatan:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data jabatan" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}