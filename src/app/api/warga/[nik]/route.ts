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
          jenis_kelamin: data.jenis_kelamin,
          tempat_lahir: data.tempat_lahir,
          tanggal_lahir: data.tanggal_lahir,
          agama: data.agama,
          status_perkawinan: data.status_perkawinan,
          jenis_pekerjaan: data.jenis_pekerjaan,
          golongan_darah: data.golongan_darah,
          kewarganegaraan: data.kewarganegaraan,
        },
      });
  
      return NextResponse.json(warga);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Gagal update' }, { status: 500 });
    }
  }