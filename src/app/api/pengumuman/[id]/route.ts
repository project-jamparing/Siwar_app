import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const pengumuman = await prisma.pengumuman.findUnique({ where: { id } });
  return NextResponse.json(pengumuman);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const { judul, subjek, isi, tanggal } = body;

  const updated = await prisma.pengumuman.update({
    where: { id },
    data: { judul, subjek, isi, tanggal: new Date(tanggal) },
  });

  return NextResponse.json(updated);
}
