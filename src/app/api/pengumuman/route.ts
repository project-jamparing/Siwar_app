import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Ambil daftar pengumuman
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const nik = searchParams.get('nik');
    const terbaru = searchParams.get('terbaru');
    const getRT = searchParams.get('get');

    // Ambil semua RT jika diminta
    if (getRT === 'rt') {
      const dataRT = await prisma.rukun_tetangga.findMany();
      return NextResponse.json(dataRT);
    }

    const whereCondition: Record<string, any> = {};

    if ((role === 'rt' || role === 'warga') && nik) {
      const warga = await prisma.warga.findUnique({ where: { nik } });
      if (!warga) {
        return NextResponse.json({ error: 'Warga tidak ditemukan' }, { status: 404 });
      }

      whereCondition.OR = [
        { rt_id: null }, // pengumuman RW
        { rt_id: warga.rt_id } // pengumuman RT sesuai warga
      ];
    }

    const orderBy = terbaru
      ? [{ tanggal: 'desc' as const }]
      : [{ tanggal: 'asc' as const }];

    const pengumuman = await prisma.pengumuman.findMany({
      where: whereCondition,
      orderBy,
    });

    return NextResponse.json(pengumuman);
  } catch (err: any) {
    console.error('🔥 ERROR GET /api/pengumuman:', err.message, err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Tambah pengumuman
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { judul, subjek, isi, tanggal, role, rt_id } = body;

    console.log('📥 POST Body:', body); // bantu debug

    // Validasi input
    if (!judul || !isi || !tanggal || !role) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    if (role === 'rt' && !rt_id) {
      return NextResponse.json({ error: 'rt_id wajib untuk role RT' }, { status: 400 });
    }

    const newPengumuman = await prisma.pengumuman.create({
      data: {
        judul,
        subjek,
        isi,
        tanggal: new Date(tanggal),
        rt_id: role === 'rt' ? rt_id : null,
      },
    });

    return NextResponse.json(newPengumuman, { status: 201 });
  } catch (err: any) {
    console.error('🔥 ERROR POST /api/pengumuman:', err.message, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT: Edit pengumuman
export async function PUT(req: Request) {
  try {
    const { id, judul, subjek, isi, tanggal, rt_id } = await req.json();

    if (!id || !judul || !isi || !tanggal) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const updated = await prisma.pengumuman.update({
      where: { id },
      data: {
        judul,
        subjek,
        isi,
        tanggal: new Date(tanggal),
        rt_id: rt_id ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('🔥 ERROR PUT /api/pengumuman:', err.message, err);
    return NextResponse.json({ error: 'Gagal update pengumuman' }, { status: 500 });
  }
}
