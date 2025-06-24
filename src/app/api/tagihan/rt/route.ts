// src/app/api/tagihan/rt/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const rtIdFromCookie = req.cookies.get('rt_id')?.value;

    if (!rtIdFromCookie) {
      return NextResponse.json(
        { success: false, message: 'RT ID tidak ditemukan di cookie. Pastikan Anda sudah login.' },
        { status: 401 }
      );
    }

    const rtIdParsed = parseInt(rtIdFromCookie);

    if (isNaN(rtIdParsed)) {
      return NextResponse.json(
        { success: false, message: 'RT ID dari cookie tidak valid (bukan format angka).' },
        { status: 400 }
      );
    }

    const tagihan = await prisma.tagihan.findMany({
      where: {
        kk: {
          rt_id: rtIdParsed,
          // kriteria_id: { // Hati-hati dengan kategori_id di sini, apakah ini di KK atau Iuran?
          //   not: 7,
          // },
        },
      },
      include: {
        iuran: true,
        kk: {
          include: {
            warga_kk_nikTowarga: {
              select: { nama: true },
            },
          },
        },
      },
      orderBy: {
        // --- GANTI DENGAN INI ---
        id: 'desc', // Ini akan memastikan tagihan terbaru muncul paling atas
        // -----------------------
      },
    });

    const result = tagihan.map((t) => ({
      id: t.id,
      nama_iuran: t.iuran?.nama || '-',
      no_kk: t.no_kk || '-',
      nama_kepala_keluarga: t.kk?.warga_kk_nikTowarga?.nama || '-',
      status: t.status === 'belum_lunas' ? 'belum bayar' : 'sudah bayar',
      tanggal_bayar: t.tanggal_bayar ? t.tanggal_bayar.toISOString().split('T')[0] : null,
      iuran_id: t.iuran?.id || 0,
    }));

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error('❌ API FAILED TO FETCH RT-SPECIFIC TAGIHAN:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data tagihan. Kesalahan internal server.' },
      { status: 500 }
    );
  }
}