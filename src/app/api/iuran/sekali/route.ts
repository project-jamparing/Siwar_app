import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    const role_id = req.cookies.get('role_id')?.value
    const rt_id = req.cookies.get('rt_id')?.value

    console.log('✅ COOKIE:', { token, role_id, rt_id })

    // Cek autentikasi
    if (!token || role_id !== '3') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    if (!rt_id || isNaN(Number(rt_id))) {
      return NextResponse.json({ message: 'RT ID tidak valid di cookie' }, { status: 400 })
    }

    const body = await req.json()
    const { nama, deskripsi, nominal, tanggal_nagih, tanggal_tempo, kategori_id } = body

    console.log('📦 BODY:', body)

    // Validasi input
    if (!nama || !nominal || !tanggal_nagih || !tanggal_tempo || !kategori_id) {
      return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 })
    }

    // Buat iuran
    const iuran = await prisma.iuran.create({
      data: {
        nama,
        deskripsi,
        nominal,
        tanggal_nagih: new Date(tanggal_nagih),
        tanggal_tempo: new Date(tanggal_tempo),
        status: 'aktif',
        kategori_id: Number(kategori_id),
      },
    })

    // Cari KK berdasarkan RT dan kategori
    const kkList = await prisma.kk.findMany({
      where: {
        rt_id: Number(rt_id),
        kategori_id: Number(kategori_id),
      },
    })

    console.log('📄 KK List:', kkList.map(k => k.no_kk))

    if (kkList.length === 0) {
      console.warn('⚠️ Tidak ada KK yang cocok dengan kategori & RT')
    }

    // Buat tagihan
    await Promise.all(
      kkList.map(async (kk) => {
        try {
          await prisma.tagihan.create({
            data: {
              no_kk: kk.no_kk,
              iuran_id: iuran.id,
              status: 'belum_lunas',
            },
          })
        } catch (tagihanError) {
          console.error(`❌ Gagal buat tagihan untuk KK ${kk.no_kk}:`, tagihanError)
        }
      })
    )

    return NextResponse.json({ message: 'Berhasil menambahkan iuran & tagihan' })
  } catch (error) {
    console.error('🔥 ERROR:', error)
    return NextResponse.json(
      { message: 'Gagal menambahkan iuran', error: String(error) },
      { status: 500 }
    )
  }
}