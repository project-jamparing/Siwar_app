import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const rt_id = req.cookies.get('rt_id')?.value;

    if (!rt_id) {
      return NextResponse.json(
        { success: false, message: 'RT ID tidak ditemukan di cookie.' },
        { status: 401 }
      );
    }

    // Ambil semua tagihan berdasarkan rt_id dan kategori_id ≠ 7
    const tagihan = await prisma.tagihan.findMany({
      where: {
        kk: {
          rt_id: parseInt(rt_id),
          kategori_id: {
            not: 7, // Filter kategori 'semua'
          },
        },
      },
      include: {
        iuran: true,
        kk: {
          include: {
            warga: {
              where: {
                status_hubungan_dalam_keluarga: 'Kepala Keluarga',
              },
            },
          },
        },
      },
    });

    // Format hasilnya
    const result = tagihan.map((t) => ({
      id: t.id,
      nama_iuran: t.iuran?.nama || '-',
      no_kk: t.no_kk || '-',
      nama_kepala_keluarga: t.kk?.warga?.[0]?.nama || '-', // Ambil Kepala Keluarga
      status: t.status === 'belum_lunas' ? 'belum bayar' : 'sudah bayar',
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('❌ API TAGIHAN RT ERROR:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal ambil data tagihan.' },
      { status: 500 }
    );
  }
}