import  prisma  from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { no_kk, rt_id, kategori_id } = body;

  try {
    const data = await prisma.kk.create({
      data: {
        no_kk,
        rt_id: rt_id ? parseInt(rt_id) : null,
        kategori_id: parseInt(kategori_id),
        nik: null // sementara null dulu
      }
    });

    return NextResponse.json({ message: 'KK berhasil ditambahkan', kk: data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Gagal menambahkan KK' }, { status: 500 });
  }
}