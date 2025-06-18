// app/api/iuran/list/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const iurans = await prisma.iuran.findMany({
    include: {
      kategori: true,
    },
  });

  return NextResponse.json(iurans);
}
