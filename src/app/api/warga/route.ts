// app/api/warga/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const role_id = Number(cookieStore.get('role_id')?.value);
    const nik = cookieStore.get('nik')?.value;

    // Admin dan RW bisa lihat semua
    if (role_id === 1 || role_id === 2) {
      const warga = await prisma.warga.findMany({
        include: {
          user: true,
        },
      });

      return NextResponse.json(warga);
    }

    // RT: ambil rt_id dari nik user yang login
    if (role_id === 3 && nik) {
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

      const warga = await prisma.warga.findMany({
        where: {
          kk: {
            rt_id: rt_id,
          },
        },
        include: {
          user: true,
        },
      });

      return NextResponse.json(warga);
    }

    // Warga: hanya bisa lihat dirinya sendiri
    if (role_id === 4 && nik) {
      const warga = await prisma.warga.findMany({
        where: {
          nik,
        },
        include: {
          user: true,
        },
      });

      return NextResponse.json(warga);
    }

    return NextResponse.json({ error: 'Role tidak valid' }, { status: 403 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Gagal ambil data warga' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Cek jika Kepala Keluarga → buat KK terlebih dahulu
    if (body.status_hubungan_dalam_keluarga === 'Kepala Keluarga') {
      await prisma.kk.create({
        data: {
          no_kk: body.no_kk,
          kategori_id: parseInt(body.kategori_id),
          rukun_tetangga: {
            connect: {
              id: parseInt(body.rt_id),
            },
          },
        },
      });
    }      

    const warga = await prisma.warga.create({
      data: {
        nik: body.nik,
        nama: body.nama,
        no_kk: body.no_kk || null,
        jenis_kelamin: body.jenis_kelamin as any,
        tempat_lahir: body.tempat_lahir || null,
        tanggal_lahir: body.tanggal_lahir ? new Date(body.tanggal_lahir) : null,
        agama: body.agama || null,
        pendidikan: body.pendidikan || null,
        jenis_pekerjaan: body.jenis_pekerjaan || null,
        golongan_darah: body.golongan_darah || null,
        status_perkawinan: body.status_perkawinan || 'belum_kawin',
        tanggal_perkawinan: body.tanggal_perkawinan ? new Date(body.tanggal_perkawinan) : null,
        status_hubungan_dalam_keluarga: body.status_hubungan_dalam_keluarga || null,
        kewarganegaraan: body.kewarganegaraan || null,
        no_paspor: body.no_paspor || null,
        no_kitap: body.no_kitap || null,
        ayah: body.ayah || null,
        ibu: body.ibu || null,
      },
    });

    return NextResponse.json(warga, { status: 201 });
  } catch (error: any) {
    console.error('Error tambah warga:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan.', error: error.message }, { status: 500 });
  }
}