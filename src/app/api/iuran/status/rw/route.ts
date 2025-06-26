import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const iuranList = await prisma.iuran.findMany({
      where: { status: 'aktif' }, // Ambil semua iuran aktif
      select: {
        id: true,
        nama: true,
        kategori_id: true, // <- Tambahin ini biar bisa cek 7 / bukan
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
        nama: iuran.nama + (iuran.kategori_id === 7 ? ' (Semua)' : ''),
        total,
        sudah,
        belum,
      }
    })

    return NextResponse.json(hasil)
  } catch (error) {
    return NextResponse.json({ message: 'Gagal ambil status iuran', error }, { status: 500 })
  }
}