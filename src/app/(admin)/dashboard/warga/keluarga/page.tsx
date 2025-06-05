import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import WargaTable from '@/components/Tables/WargaTable';

export default async function DaftarWargaPage() {
  const cookieStore = await cookies();
  const nik = cookieStore.get('nik')?.value;

  let warga = [];
  let noKK = '';

  if (nik) {
    // Ambil data user dan no_kk
    const user = await prisma.user.findUnique({
      where: { nik },
      include: {
        warga: {
          select: {
            no_kk: true,
          },
        },
      },
    });

    noKK = user?.warga?.no_kk || '';

    if (noKK) {
      warga = await prisma.warga.findMany({
        where: {
          no_kk: noKK,
        },
        orderBy: { nama: 'asc' },
      });
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      <main className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Anggota Keluarga</h1>
        </div>

        {/* Tambahan: No KK */}
        <div className="mb-4 text-sm text-gray-700">
          <span className="font-semibold">Nomor Kartu Keluarga:</span> {noKK || 'Tidak ditemukan'}
        </div>

        {/* Tabel Warga */}
        <WargaTable warga={warga}  showActions={false} />
      </main>
    </div>
  );
}
