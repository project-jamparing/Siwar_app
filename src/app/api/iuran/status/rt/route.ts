// Path: C:\Users\LENOVO\Siwar_app\src\app\api\iuran\status\rt\route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// import { getRTFromSession } from '@/lib/auth'; // uncomment this line when you have authentication

export async function GET(req: NextRequest) {
  // --- START PERUBAHAN PENTING ---
  // Mengambil rt_id dari cookie, bukan di-hardcode
  const rtIdFromCookie = req.cookies.get('rt_id')?.value;

  if (!rtIdFromCookie) {
    console.warn('⚠️ RT ID tidak ditemukan di cookie. Mengembalikan 401 Unauthorized.');
    return NextResponse.json(
      { message: 'Unauthorized: RT ID tidak ditemukan di cookie. Pastikan Anda sudah login.' },
      { status: 401 }
    );
  }

  const rtId = parseInt(rtIdFromCookie);

  if (isNaN(rtId)) {
    console.warn('⚠️ RT ID dari cookie tidak valid. Mengembalikan 400 Bad Request.');
    return NextResponse.json(
      { message: 'Bad Request: RT ID dari cookie tidak valid.' },
      { status: 400 }
    );
  }
  // --- END PERUBAHAN PENTING ---

  try {
    console.log(`▶️ Starting to fetch iuran RT status for RT ID: ${rtId}...`);

    const iuranList = await prisma.iuran.findMany({
      where: {
        status: 'aktif', // Only active iuran
        // --- PERBAIKAN DI SINI: HAPUS ATAU KOMENTARI BARIS kategori_id INI ---
        // kategori_id: 2, // Specific category ID for RT iuran (as per your system's logic) <-- HAPUS INI
        // ------------------------------------------------------------------
        tagihan: {
          some: { // Ensure there's at least one tagihan matching these criteria
            kk: {
              rt_id: rtId, // Tagihan must belong to a KK in this RT
            },
            no_kk: {
              not: null, // Ensure KK number is not null
            },
          },
        },
      },
      select: {
        id: true,
        nama: true,
        tanggal_nagih: true, // Tambahkan ini agar bisa diurutkan berdasarkan tanggal_nagih
        tagihan: {
          where: {
            kk: {
              rt_id: rtId, // Only include tagihan for this specific RT in the count
            },
            no_kk: {
              not: null, // Only count tagihan with a valid KK number
            },
          },
          select: {
            status: true, // Only need status to count 'lunas' vs 'belum'
          },
        },
      },
      orderBy: {
        id: 'desc', // Urutkan berdasarkan ID dari yang terbesar (terbaru) ke yang terkecil (terlama)
      },
    });

    console.log('✅ Raw data from prisma.iuran.findMany (before processing):');
    console.dir(iuranList, { depth: null }); // Use console.dir for better object inspection

    // Process the fetched data to calculate total, paid, and unpaid counts
    const hasil = iuranList.map((iuran) => {
      const total = iuran.tagihan.length;
      const sudah = iuran.tagihan.filter((t) => t.status === 'lunas').length;
      const belum = total - sudah;

      return {
        id: iuran.id,
        nama: iuran.nama,
        total,
        sudah,
        belum,
      };
    });

    console.log('✅ Processed iuran RT status data successfully sent.');
    return NextResponse.json(hasil); // Return the aggregated results
  } catch (error: any) {
    console.error('❌ Failed to fetch RT iuran status:', error); // Log the full error object for debugging

    return NextResponse.json(
      {
        message: 'Failed to retrieve RT iuran status. Please try again later.',
        // Only expose error message in development for security
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}