import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const role_id = Number(cookieStore.get('role_id')?.value);
    const nik = cookieStore.get('nik')?.value;

    // Hanya role RW (2) dan RT (3) yang boleh akses
    if (![2, 3].includes(role_id) || !nik) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    // Filter dasar: hanya Kepala Keluarga
    const whereFilter: any = {
      status_hubungan_dalam_keluarga: 'Kepala Keluarga',
    };

    // Jika role RT, filter berdasarkan rt_id dari user
    if (role_id === 3) {
      const userRT = await prisma.user.findUnique({
        where: { nik },
        include: {
          warga: {
            include: {
              kk: true,
            },
          },
        },
      });

      const rt_id = userRT?.warga?.kk?.rt_id;
      if (!rt_id) {
        return NextResponse.json({ error: 'RT ID tidak ditemukan' }, { status: 400 });
      }

      whereFilter.kk = {
        rt_id,
      };
    }

    // Ambil data Kepala Keluarga
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

    // Ambil data referensi RT & Kategori
    const [rtList, kategoriList] = await Promise.all([
      prisma.rukun_tetangga.findMany(),
      prisma.kategori.findMany(),
    ]);

    // Gabungkan data
    const hasil = kepalaKeluarga.map((w) => ({
      nik: w.nik,
      nama: w.nama,
      no_kk: w.kk?.no_kk ?? '-',
      rt: rtList.find((rt) => rt.id === w.kk?.rt_id)?.nama ?? '-',
      kategori: kategoriList.find((k) => k.id === w.kk?.kategori_id)?.nama ?? '-',
    }));

    return NextResponse.json(hasil);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data' }, { status: 500 });
  }
}