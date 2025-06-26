import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });
  }

  try {
    const iuran = await prisma.iuran.update({
      where: { id },
      data: { status: 'nonaktif' }, // pastikan kolom status ada di DB
    });

    return NextResponse.json(iuran, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Gagal menonaktifkan iuran' }, { status: 500 });
  }
}