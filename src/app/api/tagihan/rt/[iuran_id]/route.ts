// src/app/api/tagihan/rt/[iuran_id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { iuran_id: string } }) {
  const iuranId = parseInt(params.iuran_id)

  const tagihan = await prisma.tagihan.findMany({
    where: { iuran_id: iuranId },
    select: {
      id: true,
      status: true,
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
  })

  const hasil = tagihan.map((t) => ({
    id: t.id,
    nama: t.kk?.warga[0]?.nama ?? '-',
    no_kk: t.no_kk,
    status: t.status,
  }))

  return NextResponse.json(hasil)
}