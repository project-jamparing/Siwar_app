import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: { nik: string } }
) {
  try {
    const { nik } = params;

    const warga = await prisma.warga.delete({
      where: { nik },
    });

    return NextResponse.json(warga);
  } catch (error) {
    console.error('Gagal hapus warga:', error);
    return NextResponse.json({ message: 'Gagal hapus warga' }, { status: 500 });
  }
}