// app/api/rw/riwayat/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const iuranList = await prisma.iuran.findMany({
      orderBy: { tanggal_tempo: 'desc' },
      include: {
        tagihan: {
          include: {
            warga: {
              select: {
                no_kk: true,
                nama_kepala_keluarga: true
              }
            }
          }
        }
      }
    })

    const result = iuranList.map((iuran) => ({
      id: iuran.id,
      nama: iuran.nama,
      warga: iuran.tagihan.map((t) => ({
        no_kk: t.no_kk,
        nama_kepala_keluarga: t.warga?.nama_kepala_keluarga || '-',
        status: t.status,
        tanggal_bayar: t.tanggal_bayar
      }))
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ Gagal fetch riwayat:', error)
    return NextResponse.json({ error: 'Gagal ambil data' }, { status: 500 })
  }
}
