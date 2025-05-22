// src/app/api/pengumuman/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const data = await prisma.pengumuman.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const newPengumuman = await prisma.pengumuman.create({
    data: {
      judul: body.judul,
      subjek: body.subjek,
      isi: body.isi,
      tanggal: new Date(body.tanggal),
      rt_id: 1, 
    },
  });

  return NextResponse.json(newPengumuman, { status: 201 });
}
