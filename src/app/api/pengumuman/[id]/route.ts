import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });

  const pengumuman = await prisma.pengumuman.findUnique({ where: { id } });
  if (!pengumuman) {
    return NextResponse.json({ message: 'Pengumuman tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json(pengumuman);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });

  const body = await req.json();
  const { judul, subjek, isi, tanggal } = body;
  if (!judul || !isi || !tanggal) {
    return NextResponse.json({ message: 'Judul, isi, dan tanggal wajib diisi' }, { status: 400 });
  }

  const updated = await prisma.pengumuman.update({
    where: { id },
    data: { judul, subjek, isi, tanggal: new Date(tanggal) },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });

  try {
    await prisma.pengumuman.delete({ where: { id } });
    return NextResponse.json({ message: 'Pengumuman berhasil dihapus' });
  } catch (error) {
    console.error('Gagal hapus pengumuman:', error);
    return NextResponse.json({ message: 'Gagal hapus pengumuman' }, { status: 500 });
  }
}
