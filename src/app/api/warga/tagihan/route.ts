// app/api/warga/tagihan/route.ts
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const nik = cookieStore.get('nik')?.value

  if (!nik) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const warga = await prisma.warga.findUnique({
      where: { nik },
      select: { no_kk: true },
    })

    if (!warga?.no_kk) {
      return NextResponse.json({ error: 'No KK not found' }, { status: 404 })
    }

    const tagihan = await prisma.tagihan.findMany({
      where: { no_kk: warga.no_kk },
      include: {
        iuran: {
          select: {
            nama: true,
            deskripsi: true,
            nominal: true,
            tanggal_tempo: true,
          },
        },
      },
      orderBy: {
        iuran: {
          tanggal_tempo: 'desc',
        },
      },
    })

    return NextResponse.json(tagihan)
  } catch (error) {
    console.error('Gagal fetch tagihan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tagihan' },
      { status: 500 }
    )
  }
}
