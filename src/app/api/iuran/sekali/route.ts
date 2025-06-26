// Path: src/app/api/iuran/sekali/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    const role_id = req.cookies.get('role_id')?.value;
    const rt_id = req.cookies.get('rt_id')?.value;

    console.log('✅ COOKIE:', { token, role_id, rt_id });

    // ⛔ Cek otorisasi
    if (!token || role_id !== '3') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!rt_id || isNaN(Number(rt_id))) {
      return NextResponse.json({ message: 'RT ID tidak valid di cookie' }, { status: 400 });
    }

    const body = await req.json();
    // --- PERUBAHAN UTAMA: AMBIL kategori_id DARI BODY ---
    const { nama, deskripsi, nominal, tanggal_nagih, tanggal_tempo, kategori_id } = body;

    // ✅ Validasi data, termasuk kategori_id
    if (!nama || !nominal || !tanggal_nagih || !tanggal_tempo || kategori_id === undefined || isNaN(Number(kategori_id))) {
      return NextResponse.json({ message: 'Data tidak lengkap atau kategori_id tidak valid' }, { status: 400 });
    }

    const parsedKategoriId = Number(kategori_id); // Pastikan ini adalah angka

    // ✅ Buat iuran RT
    const iuran = await prisma.iuran.create({
      data: {
        nama,
        deskripsi,
        nominal,
        tanggal_nagih: new Date(tanggal_nagih),
        tanggal_tempo: new Date(tanggal_tempo),
        status: 'aktif',
        kategori_id: parsedKategoriId, // Gunakan kategori_id dari body
      },
    });

    // 🎯 Ambil KK sesuai RT & kategori
    const kkList = await prisma.kk.findMany({
      where: {
        rt_id: Number(rt_id),
        kategori_id: parsedKategoriId, // Gunakan kategori_id dari body untuk filter KK
      },
      select: { // Hanya ambil no_kk yang diperlukan
          no_kk: true,
      }
    });

    console.log('📄 KK List yang ditemukan untuk kategori', parsedKategoriId, ':', kkList.map((k) => k.no_kk));

    if (kkList.length === 0) {
      console.warn('⚠ Tidak ada KK yang cocok untuk kategori & RT ini.');
      // Anda mungkin ingin mengembalikan respons sukses meskipun tidak ada KK yang cocok,
      // karena iuran itu sendiri sudah berhasil dibuat.
      return NextResponse.json({ message: '✅ Berhasil menambahkan iuran, namun tidak ada KK yang cocok untuk kategori ini.' });
    }

    // 🧾 Generate tagihan per KK
    // Menggunakan createMany untuk efisiensi
    const tagihanData = kkList.map((kk) => ({
        no_kk: kk.no_kk,
        iuran_id: iuran.id,
        status: 'belum_lunas', // Default status
        // Anda mungkin ingin menambahkan tanggal_tagih/tanggal_dibuat di sini jika ada di skema Tagihan Anda
    }));

    await prisma.tagihan.createMany({
        data: tagihanData,
        skipDuplicates: true, // Opsional: Lewati jika ada duplikasi (misal, no_kk dan iuran_id sama)
    });

    return NextResponse.json({ message: '✅ Berhasil menambahkan iuran & tagihan' });
  } catch (error) {
    console.error('🔥 ERROR: Gagal menambahkan iuran dan tagihan:', error);
    return NextResponse.json(
      { message: 'Gagal menambahkan iuran', error: String(error) },
      { status: 500 }
    );
  }
}