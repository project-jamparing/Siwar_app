import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// GET: Ambil daftar pengumuman
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const nik = searchParams.get('nik'); // untuk cari rt_id warga
    const filterTerbaru = searchParams.get('terbaru');
    const getRt = searchParams.get('get'); // untuk ambil rt_id langsung

    // 🔥 NEW: kalau GET rt_id doang
    if (getRt === 'rt') {
      const nik = cookies().get('nik')?.value;

      if (!nik) {
        return NextResponse.json({ message: 'NIK tidak ditemukan di cookie' }, { status: 400 });
      }

      const warga = await prisma.warga.findUnique({
        where: { nik },
        include: { kk: true },
      });

      if (!warga || !warga.kk || !warga.kk.rt_id) {
        return NextResponse.json({ message: 'RT tidak ditemukan' }, { status: 404 });
      }

      return NextResponse.json({ rt_id: warga.kk.rt_id });
    }

    const whereCondition: any = {};

    if ((role === 'rt' || role === 'warga') && nik) {
      const warga = await prisma.warga.findUnique({
        where: { nik },
        include: { kk: true },
      });

      if (!warga || !warga.kk || !warga.kk.rt_id) {
        return NextResponse.json({ message: 'Warga tidak valid' }, { status: 400 });
      }

      whereCondition.OR = [
        { rt_id: warga.kk.rt_id },
        { rt_id: null }, // pengumuman dari RW
      ];
    } else if (role === 'rw') {
      whereCondition.OR = [
        { rt_id: null },
        { NOT: { rt_id: null } }
      ];
    }

    const orderBy = filterTerbaru === 'true' ? { tanggal: 'desc' } : undefined;

    const pengumuman = await prisma.pengumuman.findMany({
      where: whereCondition,
      include: { rukun_tetangga: true },
      orderBy,
    });

    return NextResponse.json(pengumuman);
  } catch (error) {
    console.error('Gagal ambil pengumuman:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST: Tambah pengumuman
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { judul, isi, tanggal, rt_id, subjek, role } = body;

    if (!judul || !isi || !tanggal || !role) {
      return NextResponse.json({ message: 'Field tidak lengkap' }, { status: 400 });
    }

    const newPengumuman = await prisma.pengumuman.create({
      data: {
        judul,
        isi,
        tanggal: new Date(tanggal),
        rt_id: role === 'rw' ? null : parseInt(rt_id),
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

// DELETE: Hapus pengumuman
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID tidak ditemukan' }, { status: 400 });
    }

    await prisma.pengumuman.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: 'Berhasil menghapus pengumuman' });
  } catch (error) {
    console.error('Gagal hapus pengumuman:', error);
    return NextResponse.json({ message: 'Gagal menghapus' }, { status: 500 });
  }
}
