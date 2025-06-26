import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    const tagihan = await prisma.tagihan.findMany({
      where: {
        iuran_id: parseInt(id),
        NOT: {
          no_kk: null,
        },
      },
      select: {
        id: true,
        status: true,
        tanggal_bayar: true,
        kk: {
          select: {
            no_kk: true,
            warga_kk_nikTowarga: {
              select: {
                nama: true, // ✅ ambil nama dari warga
              },
            },
          },
        },
      },
    })

    return NextResponse.json(tagihan)
  } catch (err: any) {
    console.error("❌ Error GET /iuran/[id]/tagihan:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
