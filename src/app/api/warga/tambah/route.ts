import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Buat KK jika Kepala Keluarga
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

    // Tambah warga
    const warga = await prisma.warga.create({
      data: {
        nik: body.nik,
        nama: body.nama,
        no_kk: body.no_kk || null,
        jenis_kelamin: body.jenis_kelamin,
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

    // Kalau Kepala Keluarga, buat user otomatis
    if (body.status_hubungan_dalam_keluarga === 'Kepala Keluarga') {
      const hashedPassword = await bcrypt.hash('password123', 10);

      await prisma.user.create({
        data: {
          nik: body.nik,
          no_kk: body.no_kk,
          role_id: 4,
          password: hashedPassword,
        },
      });
    }

    return NextResponse.json(warga, { status: 201 });

  } catch (error: any) {
    console.error('Error tambah warga:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan.', error: error.message }, { status: 500 });
  }
}