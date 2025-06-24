import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
// import { getRTFromSession } from '@/lib/auth' // nanti diganti ini

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const iuranId = parseInt(params.id)
  const rtId = 3 // 🔁 Sementara hardcoded, nanti ambil dari session

  if (isNaN(iuranId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    const tagihan = await prisma.tagihan.findMany({
      where: {
        iuran_id: iuranId,
        NOT: { no_kk: null },
        kk: {
          rt_id: rtId,
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
                nama: true,
              },
            },
          },
        },
      },
    })

    const hasil = tagihan.map((t) => ({
      id: t.id,
      status: t.status,
      tanggal_bayar: t.tanggal_bayar,
      kk: {
        no_kk: t.kk?.no_kk ?? '-',
        nama_kepala_keluarga: t.kk?.warga_kk_nikTowarga?.nama ?? '-',
      },
    }))

    return NextResponse.json(hasil)
  } catch (error: any) {
    console.error('❌ Gagal ambil tagihan RT:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
