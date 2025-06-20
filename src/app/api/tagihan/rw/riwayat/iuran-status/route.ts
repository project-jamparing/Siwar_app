// /app/api/rw/iuran-status/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const iuranList = await prisma.iuran.findMany({
      select: {
        id: true,
        nama: true,
        tagihan: {
          select: {
            id: true,
            status: true,
            no_kk: true,
            warga: {
              select: {
                nama_kepala_keluarga: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    })

    const formatted = iuranList.map((iuran) => ({
      id: iuran.id,
      nama: iuran.nama,
      tagihan: iuran.tagihan.map((t) => ({
        id: t.id,
        no_kk: t.no_kk,
        nama_kepala_keluarga: t.warga?.nama_kepala_keluarga || '-',
        status: t.status,
      })),
    }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error('❌ Gagal fetch iuran status:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
