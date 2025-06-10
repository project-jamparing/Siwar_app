// src/app/api/iuran/status/rt/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const iuranList = await prisma.iuran.findMany({
      where: { status: 'aktif', kategori_id: 2 }, // 2 = RT
      select: {
        id: true,
        nama: true,
        tagihan: {
          select: {
            status: true,
          },
        },
      },
    })

    const hasil = iuranList.map((iuran) => {
      const total = iuran.tagihan.length
      const sudah = iuran.tagihan.filter((t) => t.status === 'lunas').length
      const belum = total - sudah

      return {
        id: iuran.id,
        nama: iuran.nama,
        total,
        sudah,
        belum,
      }
    })

    return NextResponse.json(hasil)
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal ambil status iuran', error },
      { status: 500 }
    )
  }
}