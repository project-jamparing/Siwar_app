// Path: src/app/api/iuran/status/rw/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Pastikan path ke Prisma Client Anda benar

export async function GET() {
  try {
    const iuranList = await prisma.iuran.findMany({
      where: { status: 'aktif' }, // Ambil semua iuran aktif
      orderBy: { // <--- TAMBAHAN KODE INI UNTUK SORTING
        tanggal_nagih: 'desc', // Urutkan berdasarkan tanggal nagih terbaru di atas
      },
      select: {
        id: true,
        nama: true,
        deskripsi: true, // Tambahkan deskripsi jika ingin sorting olehnya atau melihatnya
        tanggal_nagih: true, // Pastikan tanggal_nagih juga terseleksi untuk sorting
        kategori_id: true,
        tagihan: {
          select: {
            status: true,
          },
        },
      },
    });

    const hasil = iuranList.map((iuran) => {
      const total = iuran.tagihan.length;
      const sudah = iuran.tagihan.filter((t) => t.status === 'lunas').length;
      const belum = total - sudah;

      return {
        id: iuran.id,
        nama: iuran.nama + (iuran.kategori_id === 7 ? ' (Semua)' : ''),
        total,
        sudah,
        belum,
      };
    });

    return NextResponse.json(hasil);
  } catch (error) {
    console.error("Error fetching iuran status for RW:", error);
    return NextResponse.json({ message: 'Gagal ambil status iuran', error: (error as Error).message }, { status: 500 });
  }
}
