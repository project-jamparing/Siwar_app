// Path: src/app/api/iuran/bulanan/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fungsi GET: Mengambil detail iuran berdasarkan ID (untuk form Edit)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const iuranId = parseInt(params.id);

  if (isNaN(iuranId)) {
    return NextResponse.json({ message: 'ID iuran tidak valid' }, { status: 400 });
  }

  // --- Cek Otorisasi RW ---
  const role_id = req.cookies.get('role_id')?.value;
  // Asumsi role_id RW adalah '2', dan Admin '1'. SESUAIKAN JIKA BERBEDA!
  if (role_id !== '2' && role_id !== '1') {
    return NextResponse.json({ message: 'Unauthorized: Hanya RW/Admin yang bisa melihat detail iuran ini.' }, { status: 401 });
  }
  // --- Akhir Cek Otorisasi ---

  try {
    const iuran = await prisma.iuran.findUnique({
      where: {
        id: iuranId,
      },
      select: {
        id: true,
        nama: true,
        deskripsi: true,
        nominal: true,
        tanggal_nagih: true,
        tanggal_tempo: true,
        kategori_id: true,
        status: true,
        // Tambahkan kolom lain yang Anda butuhkan di form edit
      },
    });

    if (!iuran) {
      return NextResponse.json({ message: 'Iuran tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(iuran);
  } catch (error) {
    console.error('Error fetching iuran detail:', error);
    return NextResponse.json({ message: 'Gagal mengambil detail iuran', error: String(error) }, { status: 500 });
  }
}

// Fungsi PATCH: Mengupdate iuran (mungkin digunakan oleh tombol "Nonaktif" atau Update form edit)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const iuranId = parseInt(params.id);

  if (isNaN(iuranId)) {
    return NextResponse.json({ message: 'ID iuran tidak valid' }, { status: 400 });
  }

  // --- Cek Otorisasi RW ---
  const role_id = req.cookies.get('role_id')?.value;
  if (role_id !== '2' && role_id !== '1') {
    return NextResponse.json({ message: 'Unauthorized: Hanya RW/Admin yang bisa mengubah iuran ini.' }, { status: 401 });
  }
  // --- Akhir Cek Otorisasi ---

  try {
    const body = await req.json();
    const { nama, deskripsi, nominal, tanggal_nagih, tanggal_tempo, kategori_id, status } = body;

    const updatedIuran = await prisma.iuran.update({
      where: { id: iuranId },
      data: {
        nama: nama || undefined,
        deskripsi: deskripsi || undefined,
        nominal: nominal !== undefined ? Number(nominal) : undefined,
        tanggal_nagih: tanggal_nagih ? new Date(tanggal_nagih) : undefined,
        tanggal_tempo: tanggal_tempo ? new Date(tanggal_tempo) : undefined,
        kategori_id: kategori_id !== undefined ? Number(kategori_id) : undefined,
        status: status || undefined,
      },
    });

    return NextResponse.json({ message: 'Iuran berhasil diupdate', data: updatedIuran });
  } catch (error) {
    console.error('Error updating iuran:', error);
    return NextResponse.json({ message: 'Gagal mengupdate iuran', error: String(error) }, { status: 500 });
  }
}


// Fungsi DELETE: Menghapus iuran berdasarkan ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const iuranId = parseInt(params.id);

  if (isNaN(iuranId)) {
    return NextResponse.json({ message: 'ID iuran tidak valid' }, { status: 400 });
  }

  // --- Cek Otorisasi RW ---
  const role_id = req.cookies.get('role_id')?.value;
  if (role_id !== '2' && role_id !== '1') {
    return NextResponse.json({ message: 'Unauthorized: Hanya RW/Admin yang bisa menghapus iuran ini.' }, { status: 401 });
  }
  // --- Akhir Cek Otorisasi ---

  try {
    // Penting: Hapus dulu tagihan yang terkait dengan iuran ini
    // agar tidak ada error foreign key constraint (jika relasi tidak CASCADE DELETE)
    await prisma.tagihan.deleteMany({
      where: {
        iuran_id: iuranId,
      },
    });

    // Kemudian hapus iurannya
    await prisma.iuran.delete({
      where: {
        id: iuranId,
      },
    });

    return NextResponse.json({ message: 'Iuran berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting iuran:', error);
    return NextResponse.json({ message: 'Gagal menghapus iuran', error: String(error) }, { status: 500 });
  }
}