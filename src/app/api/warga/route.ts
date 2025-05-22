import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

export async function POST(req: Request) {
    try {
      const body = await req.json();
  
      const wargaBaru = await prisma.warga.create({
        data: {
          nik: body.nik,
          nama: body.nama,
          no_kk: body.no_kk,
          jenis_kelamin: body.jenis_kelamin,
          tempat_lahir: body.tempat_lahir,
          tanggal_lahir: new Date(body.tanggal_lahir),
          agama: body.agama,
          pendidikan: body.pendidikan,
          jenis_pekerjaan: body.jenis_pekerjaan,
          golongan_darah: body.golongan_darah,
          status_perkawinan: body.status_perkawinan,
          tanggal_perkawinan: body.tanggal_perkawinan ? new Date(body.tanggal_perkawinan) : null,
          status_hubungan_dalam_keluarga: body.status_hubungan_dalam_keluarga,
          kewarganegaraan: body.kewarganegaraan,
          no_paspor: body.no_paspor,
          no_kitap: body.no_kitap,
          ayah: body.ayah,
          ibu: body.ibu,
        },
      });
  
      return NextResponse.json(wargaBaru);
    } catch (error) {
      console.error('❌ Gagal menambahkan warga:', error);
      return NextResponse.json(
        { error: 'Gagal menambahkan warga' },
        { status: 500 }
      );
    }
  }  