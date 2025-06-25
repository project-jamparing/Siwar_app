// src/app/api/tagihan/rt/[iuran_id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { iuran_id: string } }) {
  try {
    const iuranId = parseInt(params.iuran_id)

    if (isNaN(iuranId)) {
      return NextResponse.json({ success: false, message: 'ID iuran tidak valid' }, { status: 400 })
    }

    const rtIdFromCookie = req.cookies.get('rt_id')?.value
    if (!rtIdFromCookie) {
      return NextResponse.json({ success: false, message: 'RT belum login' }, { status: 401 })
    }

    const rtId = parseInt(rtIdFromCookie)
    if (isNaN(rtId)) {
      return NextResponse.json({ success: false, message: 'RT ID tidak valid' }, { status: 400 })
    }

    // Ambil kategori dari iuran ini
    const iuran = await prisma.iuran.findUnique({
      where: { id: iuranId },
      select: { kategori_id: true },
    })

    if (!iuran) {
      return NextResponse.json({ success: false, message: 'Iuran tidak ditemukan' }, { status: 404 })
    }

    // Ambil tagihan berdasarkan:
    // - iuran_id
    // - KK kategori sesuai
    // - KK berada di RT login
    const tagihan = await prisma.tagihan.findMany({
      where: {
        iuran_id: iuranId,
        kk: {
          rt_id: rtId,
          kategori_id: iuran.kategori_id,
        },
      },
      select: {
        id: true,
        status: true,
        tanggal_bayar: true,
        no_kk: true,
        kk: {
          select: {
            warga: {
              where: { status_hubungan: 'Kepala Keluarga' },
              select: { nama: true },
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    })

    const hasil = tagihan.map((t) => ({
      id: t.id,
      nama: t.kk?.warga[0]?.nama ?? '-',
      no_kk: t.no_kk,
      status: t.status === 'lunas' ? 'Sudah Bayar' : 'Belum Bayar',
      tanggal_bayar: t.tanggal_bayar?.toISOString().split('T')[0] ?? '-',
    }))

    return NextResponse.json(hasil)
  } catch (error: any) {
    console.error('❌ Error di /api/tagihan/rt/[iuran_id]:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
