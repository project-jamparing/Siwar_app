// src/app/api/iuran/aktif/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(req: NextRequest) {
  try {
    const data = await prisma.iuran.findMany({
      where: { status: 'aktif' },
      orderBy: { tanggal_nagih: 'desc' },
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil data iuran', error: error.message }, { status: 500 });
  }
}