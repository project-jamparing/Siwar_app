import prisma  from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { no_kk, nik } = body;

  try {
    const updated = await prisma.kk.update({
      where: { no_kk },
      data: { nik },
    });

    return NextResponse.json({ message: 'Kepala keluarga berhasil diset', kk: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Gagal mengatur kepala keluarga' }, { status: 500 });
  }
}