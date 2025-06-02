import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { no_kk: string } }
) {
  const { no_kk } = params;

  try {
    const warga = await prisma.warga.findMany({
      where: { no_kk },
      orderBy: { status_hubungan_dalam_keluarga: 'asc' },
    });

    return NextResponse.json(warga);
  } catch (error) {
    console.error('Error fetching keluarga by no_kk:', error);
    console.log('No KK:', no_kk);
    console.log('Anggota keluarga:', anggotaKeluarga);
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 });
  }
}