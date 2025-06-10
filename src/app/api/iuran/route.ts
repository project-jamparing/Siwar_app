import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.iuran.findMany({
      include: { kategori: true },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal ambil data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await prisma.iuran.create({
      data: {
        nama: body.nama,
        nominal: body.nominal,
        tanggal_nagih: body.tanggal_nagih,
        tanggal_tempo: body.tanggal_tempo,
        deskripsi: body.deskripsi,
        kategori_id: body.kategori_id,
        status: body.status,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal simpan data' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await prisma.iuran.update({
      where: { id: body.id },
      data: {
        nama: body.nama,
        nominal: body.nominal,
        tanggal_nagih: body.tanggal_nagih,
        tanggal_tempo: body.tanggal_tempo,
        deskripsi: body.deskripsi,
        kategori_id: body.kategori_id,
        status: body.status,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal update data' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get('id'));
  if (!id) return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });

  try {
    await prisma.iuran.delete({ where: { id } });
    return NextResponse.json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal hapus data' }, { status: 500 });
  }
}
