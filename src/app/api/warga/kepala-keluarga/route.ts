import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const role_id = Number(cookieStore.get('role_id')?.value);
    const nik = cookieStore.get('nik')?.value;

    if (role_id === 2 || role_id === 3) {
      let whereFilter: any = {
        status_hubungan_dalam_keluarga: 'Kepala Keluarga',
      };

      // Kalau RT, filter berdasarkan rt_id
      if (role_id === 3 && nik) {
        const userRT = await prisma.user.findUnique({
          where: { nik },
          include: { warga: { include: { kk: true } } },
        });

        const rt_id = userRT?.warga?.kk?.rt_id;
        if (!rt_id) {
          return NextResponse.json({ error: 'RT ID tidak ditemukan' }, { status: 400 });
        }

        whereFilter = {
          ...whereFilter,
          kk: { rt_id: rt_id },
        };
      }

      const kepalaKeluarga = await prisma.warga.findMany({
        where: whereFilter,
        select: {
          nik: true,
          nama: true,
          kk: {
            select: {
              no_kk: true,
              rt_id: true,
              kategori_id: true,
            },
          },
        },
      });      

      // Dapatkan nama RT dan kategori via ID
      const rtList = await prisma.rukun_tetangga.findMany();
      const kategoriList = await prisma.kategori.findMany();

      const hasil = kepalaKeluarga.map((w) => ({
        nik: w.nik,
        nama: w.nama,
        no_kk: w.kk?.no_kk, // ✅ Simpan di sini
        rt: rtList.find((rt) => rt.id === w.kk?.rt_id)?.nama ?? '-',
        kategori: kategoriList.find((k) => k.id === w.kk?.kategori_id)?.nama ?? '-',
      }));      

      return NextResponse.json(hasil);
    }

    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data' }, { status: 500 });
  }
}