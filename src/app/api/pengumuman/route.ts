import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const pengumuman = await prisma.pengumuman.findMany({
      orderBy: { tanggal: 'desc' },
    });
    return NextResponse.json(pengumuman);
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal ambil data pengumuman' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { judul, subjek, isi, tanggal } = body;

    const newPengumuman = await prisma.pengumuman.create({
      data: {
        judul,
        subjek,
        isi,
        tanggal: new Date(tanggal),
      },
    });

    return NextResponse.json(newPengumuman, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal tambah pengumuman' },
      { status: 500 }
    );
  }
}
