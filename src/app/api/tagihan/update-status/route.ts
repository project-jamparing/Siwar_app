import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, tanggal_bayar } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID tagihan wajib diisi' }, { status: 400 });
    }

    if (!status || (status !== 'belum_lunas' && status !== 'sudah_lunas')) {
      return NextResponse.json({ error: 'Status harus "belum_lunas" atau "sudah_lunas"' }, { status: 400 });
    }

    // Jika status sudah_lunas tapi tanggal_bayar tidak dikirim, set tanggal sekarang
    const bayarDate = status === 'sudah_lunas' ? (tanggal_bayar ? new Date(tanggal_bayar) : new Date()) : null;

    const updatedTagihan = await prisma.tagihan.update({
      where: { id },
      data: {
        status,
        tanggal_bayar: bayarDate,
      },
    });

    return NextResponse.json({ message: 'Status tagihan berhasil diupdate', updatedTagihan });
  } catch (error) {
    console.error('API Error PATCH /tagihan/update-status:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengupdate status tagihan' }, { status: 500 });
  }
}