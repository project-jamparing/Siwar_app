// app/api/warga/tagihan/route.ts
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.nik) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Dapatkan data warga berdasarkan NIK yang login
    const warga = await prisma.warga.findUnique({
      where: { nik: session.user.nik },
      select: { no_kk: true }
    })

    if (!warga?.no_kk) {
      return NextResponse.json({ error: 'No KK not found' }, { status: 404 })
    }

    // Ambil semua tagihan berdasarkan no_kk
    const tagihan = await prisma.tagihan.findMany({
      where: { no_kk: warga.no_kk },
      include: {
        iuran: {
          select: {
            nama: true,
            deskripsi: true,
            nominal: true,
            tanggal_tempo: true
          }
        }
      },
      orderBy: {
        iuran: {
          tanggal_tempo: 'desc'
        }
      }
    })

    return NextResponse.json(tagihan)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tagihan' },
      { status: 500 }
    )
  }
}