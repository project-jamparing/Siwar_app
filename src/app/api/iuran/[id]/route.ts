import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const iuran = await prisma.iuran.findUnique({
    where: { id },
  });
  return NextResponse.json(iuran);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await req.json();

  const updated = await prisma.iuran.update({
    where: { id },
    data: {
      nama: body.nama,
      deskripsi: body.deskripsi,
      nominal: body.nominal,
      tanggal_nagih: new Date(body.tanggal_nagih),
      tanggal_tempo: new Date(body.tanggal_tempo),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
    await prisma.iuran.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Iuran berhasil dihapus' });
  } catch (error) {
    console.error('Gagal menghapus iuran:', error);
    return NextResponse.json({ message: 'Gagal menghapus iuran' }, { status: 500 });
  }
}
