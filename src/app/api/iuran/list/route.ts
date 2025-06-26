import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kategori = searchParams.get('kategori');

  const whereClause = kategori && kategori !== ''
    ? { kategori_id: parseInt(kategori) }
    : {}; // Semua kategori kalau kosong

  const iurans = await prisma.iuran.findMany({
    where: whereClause,
    include: {
      kategori: true,
    },
    orderBy: {
      tanggal_nagih: 'desc',
    },
  });

  return NextResponse.json(iurans);
}
