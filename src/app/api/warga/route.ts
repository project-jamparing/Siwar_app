import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    const warga = await prisma.warga.findMany({
      include: {
        user: true,
      },
    });

    return NextResponse.json(warga);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Gagal ambil data warga' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = await prisma.warga.create({
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

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error tambah warga:', error);
    console.error('Body:', body); 
    return NextResponse.json({ message: 'Terjadi kesalahan.', error: error.message }, { status: 500 });
  }
}