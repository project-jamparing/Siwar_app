import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { iuranId: string } }) {
  const id = Number(params.iuranId)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid iuran ID' }, { status: 400 })
  }

  try {
    const tagihan = await prisma.tagihan.findMany({
      where: {
        iuran_id: id,
        NOT: {
          no_kk: null, // ✅ Filter tambahan supaya relasi kk gak null
        },
      },
      select: {
        id: true,
        status: true,
        tanggal_bayar: true,
        kk: {
          select: {
            no_kk: true,
            nama_kepala_keluarga: true,
          },
        },
      },
    })

    return NextResponse.json(tagihan)
  } catch (err) {
    console.error('❌ Error GET /iuran/[id]/tagihan:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
