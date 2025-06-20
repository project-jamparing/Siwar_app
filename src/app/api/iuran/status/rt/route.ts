import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const rtId = 3 // ⬅️ Sementara: RT ID hardcoded

  if (!rtId || typeof rtId !== 'number') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const iuranList = await prisma.iuran.findMany({
      where: {
        status: 'aktif',
        kategori_id: 2,
        tagihan: {
          some: {
            NOT: { no_kk: null }, // ✅ Tambahkan ini agar relasi ke kk bisa difilter
            kk: {
              rt_id: rtId,
            },
          },
        },
      },
      select: {
        id: true,
        nama: true,
        tagihan: {
          where: {
            NOT: { no_kk: null }, // ✅ Tambahkan ini juga di select
            kk: {
              rt_id: rtId,
            },
          },
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
  } catch (error: any) {
    console.error('❌ Gagal ambil data iuran RT:', error.message || error)
    return NextResponse.json(
      {
        message: 'Gagal ambil status iuran',
        error: error.message || 'Internal Error',
      },
      { status: 500 }
    )
  }
}
