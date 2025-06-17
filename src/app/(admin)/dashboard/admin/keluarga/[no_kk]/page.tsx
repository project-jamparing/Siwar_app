import DetailKeluargaTable from '@/components/Tables/DetailKeluargaTable';
import BackButton from '@/components/Buttons/BackButton';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function DetailKeluargaPage({ params }: { params: { no_kk: string } }) {
  const { no_kk } = await params;

  let anggotaKeluarga = await prisma.warga.findMany({
    where: { no_kk },
  });

  if (!anggotaKeluarga || anggotaKeluarga.length === 0) {
    notFound();
  }

  // Urutkan berdasarkan status hubungan
  const urutanStatus = ['Kepala Keluarga', 'Istri', 'Anak'];
  anggotaKeluarga = anggotaKeluarga.sort((a, b) => {
    const indexA = urutanStatus.indexOf(a.status_hubungan_dalam_keluarga);
    const indexB = urutanStatus.indexOf(b.status_hubungan_dalam_keluarga);
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            👪 Detail Keluarga
          </h1>
          <span className="text-sm mt-2 sm:mt-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            No KK: {no_kk}
          </span>
        </div>

        <div className="mb-6">
          <BackButton />
        </div>

        <div className="border-t pt-6">
          <DetailKeluargaTable anggotaKeluarga={anggotaKeluarga} />
        </div>
      </div>
    </div>
  );
}