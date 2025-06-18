// src/app/api/iuran/bulanan/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();

  const iuran = await prisma.iuran.create({
    data: {
      nama: body.nama,
      deskripsi: body.deskripsi,
      nominal: body.nominal,
      tanggal_nagih: new Date(body.tanggal_nagih),
      tanggal_tempo: new Date(body.tanggal_tempo),
      kategori_id: body.kategori_id,
    },
  });

  return NextResponse.json(iuran);
}