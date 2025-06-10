// src/app/api/iuran/bulanan/route.ts

import { NextRequest, NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';
import dayjs from 'dayjs';

export async function POST(req: NextRequest) {
  try {
    const { nama, deskripsi, nominal, tanggal_tempo, kategori_id } = await req.json();

    const tanggal_nagih = new Date(); // tanggal hari ini
    const tempo = new Date(tanggal_tempo);

    // 1. Tambah ke tabel iuran
    const iuranBaru = await prisma.iuran.create({
      data: {
        nama,
        deskripsi,
        nominal,
        tanggal_nagih,
        tanggal_tempo: tempo,
        kategori_id: parseInt(kategori_id),
        status: 'aktif',
      },
    });

    // 2. Ambil semua no_kk sesuai kategori
    const kategoriIdNumber = parseInt(kategori_id);

    const kkList = await prisma.kk.findMany({
    where: kategoriIdNumber === 7 ? {} : { kategori_id: kategoriIdNumber },
    select: { no_kk: true },
    });


    // 3. Cek apakah sudah pernah dibuat bulan ini
    const bulanIni = dayjs().startOf('month').toDate();

    const tagihanAda = await prisma.tagihan.findFirst({
      where: {
        iuran_id: iuranBaru.id,
        tanggal_bayar: {
          gte: bulanIni,
        },
      },
    });

    if (tagihanAda) {
      return NextResponse.json({ message: 'Tagihan bulan ini sudah dibuat.' }, { status: 400 });
    }

    // 4. Buat tagihan ke semua KK
    await prisma.tagihan.createMany({
      data: kkList.map((kk) => ({
        no_kk: kk.no_kk,
        iuran_id: iuranBaru.id,
        status: 'belum_lunas',
      })),
    });

    return NextResponse.json({ message: 'Iuran bulanan berhasil dibuat.' });
  } catch (error: any) {
    console.error('ERROR:', error);
    return NextResponse.json({ message: 'Gagal membuat iuran bulanan.', error: error.message }, { status: 500 });
  }
}