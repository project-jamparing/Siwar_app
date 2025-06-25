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

    // Ambil semua tagihan dari warga yang berada di RT login
    const rawTagihan = await prisma.tagihan.findMany({
      where: {
        kk: {
          rt_id: rtIdParsed,
        },
      },
      include: {
        iuran: {
          select: {
            id: true,
            nama: true,
            kategori_id: true,
          },
        },
        kk: {
          select: {
            no_kk: true,
            kategori_id: true,
            warga_kk_nikTowarga: {
              select: { nama: true },
            },
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Filter hanya tagihan dengan kategori KK == kategori Iuran
    const filteredTagihan = rawTagihan.filter(
      (t) => t.iuran?.kategori_id === t.kk?.kategori_id
    );

    const result = filteredTagihan.map((t) => ({
      id: t.id,
      nama_iuran: t.iuran?.nama || '-',
      no_kk: t.kk?.no_kk || '-',
      nama_kepala_keluarga: t.kk?.warga_kk_nikTowarga?.nama || '-',
      status: t.status === 'lunas' ? 'sudah bayar' : 'belum bayar',
      tanggal_bayar: t.tanggal_bayar
        ? t.tanggal_bayar.toISOString().split('T')[0]
        : null,
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
