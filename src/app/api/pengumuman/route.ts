import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const nik = searchParams.get('nik');
    const filterTerbaru = searchParams.get('terbaru');

    const whereCondition: any = {};

    if (filterTerbaru === 'true') {
      const duaHariLalu = new Date();
      duaHariLalu.setDate(duaHariLalu.getDate() - 2);
      whereCondition.tanggal = { gte: duaHariLalu };
    }

    if (role === 'warga' || role === 'rt') {
      if (!nik) {
        return NextResponse.json({ message: 'NIK tidak ditemukan' }, { status: 400 });
      }

      const warga = await prisma.warga.findUnique({
        where: { nik },
        include: { kk: true },
      });

      if (!warga || !warga.kk || !warga.kk.rt_id) {
        return NextResponse.json({ message: 'RT tidak ditemukan' }, { status: 400 });
      }

      whereCondition.rt_id = warga.kk.rt_id;
    }

    const pengumuman = await prisma.pengumuman.findMany({
      where: whereCondition,
      orderBy: { tanggal: 'desc' },
      include: { rukun_tetangga: true },
    });

    return NextResponse.json(pengumuman);
  } catch (error) {
    console.error('Gagal ambil data pengumuman:', error);
    return NextResponse.json({ message: 'Gagal ambil data pengumuman' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { judul, isi, tanggal, rt_id, subjek } = body;

    if (!judul || !isi || !tanggal || !rt_id) {
      return NextResponse.json({ message: 'Field tidak lengkap' }, { status: 400 });
    }

    const newPengumuman = await prisma.pengumuman.create({
      data: {
        judul,
        isi,
        tanggal: new Date(tanggal),
        rt_id: parseInt(rt_id),
        subjek: subjek ?? '',
      },
      include: {
        rukun_tetangga: true,
      },
    });

    return NextResponse.json(newPengumuman);
  } catch (error) {
    console.error('Gagal tambah pengumuman:', error);
    return NextResponse.json({ message: 'Gagal menambahkan pengumuman' }, { status: 500 });
  }
}
