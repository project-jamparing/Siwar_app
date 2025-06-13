import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { no_kk: string } }) {
  const oldNoKK = params.no_kk;
  const body = await req.json();
  const { no_kk: newNoKK, rt_id, kategori } = body;

  if (!newNoKK || !rt_id || !kategori) {
    return new Response(JSON.stringify({ message: 'Data tidak lengkap' }), { status: 400 });
  }

  try {
    if (oldNoKK !== newNoKK) {
      // Cek jika newNoKK sudah ada
      const existingKK = await prisma.kk.findUnique({ where: { no_kk: newNoKK } });
      if (existingKK) {
        return new Response(JSON.stringify({ message: `No KK ${newNoKK} sudah terdaftar` }), {
          status: 409,
        });
      }

      // 1. Tambah KK baru
      await prisma.kk.create({
        data: {
          no_kk: newNoKK,
          rt_id: parseInt(rt_id),
          kategori_id: parseInt(kategori),
        },
      });

      // 2. Pindah semua warga ke KK baru
      await prisma.warga.updateMany({
        where: { no_kk: oldNoKK },
        data: { no_kk: newNoKK },
      });

      // 3. Hapus KK lama
      await prisma.kk.delete({
        where: { no_kk: oldNoKK },
      });
    } else {
      // Update jika no_kk tidak berubah
      await prisma.kk.update({
        where: { no_kk: oldNoKK },
        data: {
          rt_id: parseInt(rt_id),
          kategori_id: parseInt(kategori),
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Berhasil update KK' }), { status: 200 });
  } catch (error: any) {
    console.error('[EDIT_KK_ERROR]', error);
    return new Response(JSON.stringify({ message: error.message || 'Gagal update KK' }), {
      status: 500,
    });
  }
}