import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Ambil semua atau hanya pengumuman 2 hari terakhir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterTerbaru = searchParams.get('terbaru');

    let whereCondition = {};

    // Jika query param ?terbaru=true, ambil hanya pengumuman 2 hari terakhir
    if (filterTerbaru === 'true') {
      const duaHariLalu = new Date();
      duaHariLalu.setDate(duaHariLalu.getDate() - 2);

      whereCondition = {
        tanggal: {
          gte: duaHariLalu,
        },
      };
    }

    const pengumuman = await prisma.pengumuman.findMany({
      where: whereCondition,
      orderBy: { tanggal: 'desc' },
      include: { rukun_tetangga: true }, // opsional kalau kamu butuh detail RT-nya
    });

    return NextResponse.json(pengumuman);
  } catch (error) {
    console.error('Error saat ambil data pengumuman:', error);
    return NextResponse.json(
      { message: 'Gagal ambil data pengumuman' },
      { status: 500 }
    );
  }
}

// POST: Tambah pengumuman baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { judul, subjek, isi, tanggal, rt_id } = body;

    const newPengumuman = await prisma.pengumuman.create({
      data: {
        judul,
        subjek,
        isi,
        tanggal: new Date(tanggal),
        rt_id,
      },
    });

    return NextResponse.json(newPengumuman, { status: 201 });
  } catch (error) {
    console.error('Error saat tambah pengumuman:', error);
    return NextResponse.json(
      { message: 'Gagal tambah pengumuman' },
      { status: 500 }
    );
  }
}
