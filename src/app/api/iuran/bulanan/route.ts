import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      nama,
      deskripsi,
      nominal,
      tanggal_nagih,
      tanggal_tempo,
      kategori_id
    } = body

    // 1. Buat Iuran Baru
    const newIuran = await prisma.iuran.create({
      data: {
        nama,
        deskripsi,
        nominal,
        tanggal_nagih: new Date(tanggal_nagih),
        tanggal_tempo: new Date(tanggal_tempo),
        status: 'aktif',
        kategori_id,
      },
    })

    // 2. Ambil KK sesuai kategori
    const kkList = await prisma.kk.findMany({
      where: {
        kategori_id: kategori_id,
      },
      select: {
        no_kk: true,
      },
    })

    if (kkList.length === 0) {
      return NextResponse.json({
        message: 'Iuran dibuat, tapi tidak ada KK dengan kategori ini.',
        iuran: newIuran,
        jumlahTagihanDibuat: 0
      }, { status: 200 })
    }

    // 3. Ambil tagihan yang sudah ada untuk iuran ini
    const existingTagihan = await prisma.tagihan.findMany({
      where: {
        iuran_id: newIuran.id,
      },
      select: {
        no_kk: true,
      },
    })

    const existingNoKKSet = new Set(existingTagihan.map(t => t.no_kk))

    // 4. Buat list tagihan baru hanya untuk KK yang belum punya tagihan
    const tagihanToCreate = kkList
      .filter(kk => !existingNoKKSet.has(kk.no_kk))
      .map(kk => ({
        iuran_id: newIuran.id,
        no_kk: kk.no_kk,
        status: 'belum_lunas',
        tanggal_bayar: null,
      }))

    if (tagihanToCreate.length > 0) {
      await prisma.tagihan.createMany({
        data: tagihanToCreate,
      })
    }

    return NextResponse.json({
      message: 'Iuran dan tagihan berhasil dibuat!',
      iuran: newIuran,
      jumlahTagihanDibuat: tagihanToCreate.length
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Error saat membuat iuran dan tagihan:', error)
    return NextResponse.json({
      message: 'Gagal membuat iuran dan tagihan.',
      error: error.message,
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const iurans = await prisma.iuran.findMany({
      include: {
        kategori: true,
        tagihan: true,
      },
    })

    return NextResponse.json(iurans)
  } catch (error: any) {
    console.error('❌ Gagal mengambil daftar iuran bulanan:', error)
    return NextResponse.json({
      message: 'Gagal mengambil daftar iuran bulanan.',
      error: error.message
    }, { status: 500 })
  }
}
