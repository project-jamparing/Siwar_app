import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const no_kk = searchParams.get('no_kk');

    if (!no_kk) {
      return NextResponse.json({ error: 'No KK wajib diisi' }, { status: 400 });
    }

    // Ambil semua tagihan berdasarkan no_kk
    const tagihanList = await prisma.tagihan.findMany({
      where: { no_kk },
      include: {
        iuran: true, // ambil data iuran terkait
      },
      orderBy: {
        // Urutkan berdasarkan tanggal nagih iuran (atau tanggal bayar kalau mau)
        iuran: {
          tanggal_nagih: 'desc',
        },
      },
    });

    // Format data supaya lebih rapi
    const result = tagihanList.map((tagihan) => ({
      id: tagihan.id,
      no_kk: tagihan.no_kk,
      status: tagihan.status ?? 'belum_lunas',
      tanggal_bayar: tagihan.tanggal_bayar ? tagihan.tanggal_bayar.toISOString().split('T')[0] : null,
      iuran: {
        id: tagihan.iuran?.id,
        nama: tagihan.iuran?.nama,
        deskripsi: tagihan.iuran?.deskripsi,
        nominal: tagihan.iuran?.nominal.toString(),
        tanggal_nagih: tagihan.iuran?.tanggal_nagih.toISOString().split('T')[0],
        tanggal_tempo: tagihan.iuran?.tanggal_tempo.toISOString().split('T')[0],
        status: tagihan.iuran?.status,
        kategori_id: tagihan.iuran?.kategori_id,
      },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error GET /tagihan/warga:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data tagihan' }, { status: 500 });
  }
}