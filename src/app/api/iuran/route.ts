// File: app/api/iuran/route.ts
import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';

export async function GET() {
  try {
    const tagihan = await prisma.tagihan.findMany({
      include: {
        iuran: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    const result = tagihan.map((item) => ({
      id: item.id,
      nama: item.iuran?.nama,
      nominal: item.iuran?.nominal,
      status: item.status === 'lunas' ? 'Sudah Bayar' : '-',
      tanggal_bayar: item.tanggal_bayar ?? null,
      jatuh_tempo: item.iuran?.tanggal_tempo,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}