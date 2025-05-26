import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: { nik: string } }
) {
  try {
    const { nik } = params;

    const warga = await prisma.warga.delete({
      where: { nik },
    });

    return NextResponse.json(warga);
  } catch (error) {
    console.error('Gagal hapus warga:', error);
    return NextResponse.json({ message: 'Gagal hapus warga' }, { status: 500 });
  }
}
export async function GET(req: NextRequest, { params }: { params: { nik: string } }) {
    try {
      const warga = await prisma.warga.findUnique({
        where: { nik: params.nik },
      });
  
      if (!warga) return NextResponse.json({ message: 'Tidak ditemukan' }, { status: 404 });
  
      return NextResponse.json(warga);
    } catch (error) {
        console.log(error);
      return NextResponse.json({ message: 'Gagal mengambil data' }, { status: 500 });
    }
  }
  
  export async function PUT(req: NextRequest, { params }: { params: { nik: string } }) {
    try {
      const data = await req.json();
  
      const warga = await prisma.warga.update({
        where: { nik: params.nik },
        data: {
          nama: data.nama,
          no_kk: data.no_kk,
          jenis_kelamin: data.jenis_kelamin,
          tempat_lahir: data.tempat_lahir,
          tanggal_lahir: data.tanggal_lahir ? new Date(data.tanggal_lahir) : null,
          agama: data.agama,
          pendidikan: data.pendidikan,
          jenis_pekerjaan: data.jenis_pekerjaan,
          golongan_darah: data.golongan_darah,
          status_perkawinan: data.status_perkawinan,
          tanggal_perkawinan: data.tanggal_perkawinan ? new Date(data.tanggal_perkawinan) : null,
          status_hubungan_dalam_keluarga: data.status_hubungan_dalam_keluarga,
          kewarganegaraan: data.kewarganegaraan,
          no_paspor: data.no_paspor,
          no_kitap: data.no_kitap,
          ayah: data.ayah,
          ibu: data.ibu,
        },
      });      
  
      return NextResponse.json(warga);
    } catch (error) {
      console.error('Gagal update warga:', error);
      return NextResponse.json({ message: 'Gagal update warga' }, { status: 500 });
    }
  }