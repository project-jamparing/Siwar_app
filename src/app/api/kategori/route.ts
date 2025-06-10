// app/api/kategori/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const kategori = await prisma.kategori.findMany(); // atau nama tabel kamu
  return NextResponse.json(kategori);
}