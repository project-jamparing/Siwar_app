// Path: src/app/api/iuran/status/rw/[id_iuran]/detail-pembayaran-warga/route.ts
// Ini adalah API backend untuk mendapatkan detail status pembayaran satu jenis iuran
// untuk semua warga di seluruh RT di bawah RW yang sedang login.

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // PASTIKAN PATH KE PRISMA CLIENT ANDA BENAR

export async function GET(request: Request, { params }: { params: { id_iuran: string } }) {
  try {
    const iuranId = parseInt(params.id_iuran); // Ambil ID iuran dari parameter URL
    
    if (isNaN(iuranId)) {
      return NextResponse.json({ message: 'ID Iuran tidak valid' }, { status: 400 });
    }

    // --- Bagian 1: Verifikasi Otorisasi RW ---
    // Ganti dengan logika autentikasi asli Anda di sini
    const rwId = 1; // Contoh: Asumsikan RW ID 1 untuk testing. Ganti dengan ID RW dari sesi pengguna.


    // --- Bagian 2: Query Database untuk Mengambil Data ---
    // Logika ini disesuaikan dengan SKEMA PRISMA yang Anda berikan.

    // 1. Ambil semua ID RT yang berada di bawah RW ini
    // Asumsi: Ada tabel `rukun_tetangga` yang punya kolom `rwId` untuk relasi ke tabel RW.
    // JIKA TIDAK ADA KOLOM `rwId` DI `rukun_tetangga`, BERI TAHU SAYA BAGAIMANA RT TERKAIT DENGAN RW!
    // Untuk saat ini, saya akan asumsikan RW memiliki hubungan dengan RT melalui tabel `rukun_tetangga`.
    // Atau jika RW hanya punya 1 RT, mungkin bisa langsung ambil semua RT.

    // Karena di skema rukun_tetangga tidak ada rwId, kita ASUMSIKAN dulu
    // RW bisa melihat SEMUA RT. Atau ada tabel `rw` dan `rt` yang berelasi `rw_id` di `rt`.
    // JIKA `rukun_tetangga` TIDAK PUNYA `rwId` DAN TIDAK ADA TABEL `rw`,
    // MAKA KITA HARUS AMBIL SEMUA RT.
    // Jika ada tabel `rw_rt` atau relasi lain, Anda perlu menyesuaikannya.

    // SEMENTARA, KITA AKAN AMBIL SEMUA RT DULU JIKA TIDAK ADA RELASI RW-RT EKSPLISIT DI SKEMA ANDA.
    // Jika RW hanya mengelola RT tertentu, Anda perlu filter di sini.
    const allRts = await prisma.rukun_tetangga.findMany({
      select: {
        id: true, 
      },
    });
    const rtIds = allRts.map(rt => rt.id);


    // 2. Ambil semua tagihan (pembayaran) untuk IURAN SPESIFIK dan WARGA di RTs tersebut
    const rawTagihanData = await prisma.tagihan.findMany({
      where: {
        iuran_id: iuranId, // Filter utama berdasarkan ID IURAN yang diklik!
        no_kk: { // Pastikan no_kk di tagihan tidak null (hanya untuk yang punya relasi kk)
          not: null,
        },
        kk: { // Relasi ke tabel 'kk'
          rt_id: { // Filter KK yang berada di RT dengan ID yang termasuk dalam daftar rtIds
            in: rtIds,
          },
        },
      },
      select: { // Pilih kolom-kolom yang dibutuhkan
        id: true, // Ini akan jadi 'id_pembayaran' di frontend
        tanggal_bayar: true,
        status: true,
        iuran: { // Relasi ke tabel 'iuran'
          select: {
            nama: true, // Ini akan mengambil NAMA IURAN ASLI dari DATABASE
          },
        },
        kk: { // Relasi ke tabel 'kk'
          select: {
            no_kk: true,
            // Untuk nama_kepala_keluarga, kita harus ambil dari tabel `warga`
            // yang punya relasi `kk_nikTowarga` ke tabel `kk`.
            // Asumsi: Kepala Keluarga adalah warga yang punya `nik` di tabel `kk`.
            warga_kk_nikTowarga: { // Ini adalah nama relasi di Prisma skema Anda
                select: {
                    nama: true, // Ambil nama warga yang jadi Kepala Keluarga
                }
            }
          },
        },
      },
    });

    // 3. Format data dari database agar sesuai dengan interface frontend
    const formattedData = rawTagihanData.map(tagihan => ({
      id_pembayaran: tagihan.id,
      nama_iuran: tagihan.iuran?.nama || 'N/A', // Nama iuran ASLI dari DB
      no_kk: tagihan.kk?.no_kk || 'N/A',
      // Ambil nama kepala keluarga dari relasi `warga_kk_nikTowarga`
      nama_kepala_keluarga: tagihan.kk?.warga_kk_nikTowarga?.nama || 'N/A', 
      status: tagihan.status || 'belum_diketahui', // Sesuaikan dengan nilai status di DB Anda (lunas/belum_lunas)
      tanggal_bayar: tagihan.tanggal_bayar ? tagihan.tanggal_bayar.toISOString() : null, // Konversi objek Date ke string ISO 8601
    }));

    // --- Bagian 3: Kirim Respons ---
    return NextResponse.json(formattedData); // KIRIM DATA YANG DIAMBIL DARI DATABASE ASLI

  } catch (error: any) {
    console.error('Error in /api/iuran/status/rw/[id_iuran]/detail-pembayaran-warga:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
