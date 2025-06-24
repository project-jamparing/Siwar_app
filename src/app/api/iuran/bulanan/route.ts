// Path: src/app/api/iuran/bulanan/route.ts
// API ini berfungsi untuk membuat definisi iuran bulanan baru
// DAN secara otomatis membuat tagihan untuk semua Kepala Keluarga yang relevan.

import { NextRequest, NextResponse } from 'next/server';
// Pastikan Anda mengimpor instance prisma yang sudah diinisialisasi sebagai SINGLETON
// Misalnya dari src/lib/prisma.ts atau src/lib/db.ts
import prisma from '@/lib/prisma'; // <--- PASTIKAN PATH KE PRISMA CLIENT ANDA BENAR

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Buat Definisi Iuran Baru di tabel 'iuran'
    const newIuran = await prisma.iuran.create({
      data: {
        nama: body.nama,
        deskripsi: body.deskripsi,
        nominal: body.nominal,
        tanggal_nagih: new Date(body.tanggal_nagih),
        tanggal_tempo: new Date(body.tanggal_tempo),
        status: 'aktif', // Asumsi iuran baru otomatis aktif
        kategori_id: body.kategori_id,
      },
    });

    // 2. Ambil Semua Kepala Keluarga (KK) yang ada di sistem
    // ASUMSI SEMENTARA: Iuran RW berlaku untuk semua KK di semua RT.
    // PENTING: JIKA ADA LOGIKA RW-RT YANG LEBIH SPESIFIK DI DATABASE ANDA (misal: rt.rwId),
    // MAKA LOGIKA INI HARUS DIUBAH UNTUK MEMFILTER HANYA KK DI RT YANG RELEVAN DENGAN RW LOGIN.
    // Misalnya, jika ada tabel `rt` dengan `rwId` dan `kk` terhubung ke `rt`:
    /*
    const rwIdFromSession = 1; // Ganti dengan RW ID dari sesi login RW yang sebenarnya
    const rtsUnderRw = await prisma.rukun_tetangga.findMany({
      where: {
        rwId: rwIdFromSession, // Asumsi `rukun_tetangga` punya kolom `rwId`
      },
      select: { id: true }
    });
    const rtIdsUnderRw = rtsUnderRw.map(rt => rt.id);

    const allKk = await prisma.kk.findMany({
      where: {
        rt_id: {
          in: rtIdsUnderRw,
        },
      },
      select: { no_kk: true },
    });
    */
    // Jika tidak ada relasi RW ke RT di database Anda, maka `allKk` akan mengambil semua KK.
    const allKk = await prisma.kk.findMany({
      select: {
        no_kk: true,
      },
    });

    // 3. Buat Tagihan Individual untuk Setiap Kepala Keluarga
    const tagihanToCreate = allKk.map(kk => ({
      iuran_id: newIuran.id, // ID iuran yang baru saja dibuat
      no_kk: kk.no_kk,
      status: 'belum_lunas', // Status awal tagihan
      tanggal_bayar: null, // Belum dibayar
    }));

    // Masukkan semua tagihan ke database secara batch (sekaligus)
    await prisma.tagihan.createMany({
      data: tagihanToCreate,
      skipDuplicates: true, // Untuk menghindari error jika ada duplikat (opsional)
    });

    return NextResponse.json({
      message: 'Iuran dan tagihan berhasil dibuat!',
      iuran: newIuran,
      jumlahTagihanDibuat: tagihanToCreate.length
    }, { status: 201 }); // Status 201 Created

  } catch (error: any) {
    console.error('❌ Error saat membuat iuran dan tagihan:', error);
    return NextResponse.json({ 
      message: 'Gagal membuat iuran dan tagihan.', 
      error: error.message 
    }, { status: 500 });
  } 
  // HAPUS BARIS INI: await prisma.$disconnect(); // <<< DIHAPUS UNTUK SINGLETON PRISMA
}

// Opsional: Jika Anda juga punya GET untuk daftar iuran bulanan
export async function GET(req: NextRequest) {
  try {
    const iurans = await prisma.iuran.findMany({
      where: {
        // Filter iuran yang bulanan jika ada kategori khusus atau tipe di DB Anda
        // Untuk sekarang, asumsikan semua iuran di endpoint ini adalah bulanan
      },
      include: {
        kategori: true,
        tagihan: true, // Untuk hitung total sudah/belum lunas jika perlu
      },
    });
    return NextResponse.json(iurans);
  } catch (error: any) {
    console.error('❌ Gagal mengambil daftar iuran bulanan:', error);
    return NextResponse.json({ message: 'Gagal mengambil daftar iuran bulanan.', error: error.message }, { status: 500 });
  } 
  // HAPUS BARIS INI: await prisma.$disconnect(); // <<< DIHAPUS UNTUK SINGLETON PRISMA
}
