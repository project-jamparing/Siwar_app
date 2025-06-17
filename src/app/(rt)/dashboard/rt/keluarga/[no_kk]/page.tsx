import DetailKeluargaTable from '@/components/Tables/DetailKeluargaTable';
import BackButton from '@/components/Buttons/BackButton';
import prisma  from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function DetailKeluargaPage({ params }: Props) {
  const { no_kk } = await params;

  let anggotaKeluarga = await prisma.warga.findMany({
    where: { no_kk },
  });

  if (!anggotaKeluarga || anggotaKeluarga.length === 0) {
    notFound();
  }

  // Sorting manual urutan Kepala Keluarga, Istri, Anak
  const urutanStatus = ['Kepala Keluarga', 'Istri', 'Anak'];
  anggotaKeluarga = anggotaKeluarga.sort((a, b) => {
    const indexA = urutanStatus.indexOf(a.status_hubungan_dalam_keluarga);
    const indexB = urutanStatus.indexOf(b.status_hubungan_dalam_keluarga);
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md text-gray-900">
      <h1 className="text-2xl font-bold mb-6">Detail Keluarga: {no_kk}</h1>
      <BackButton />
      <DetailKeluargaTable anggotaKeluarga={anggotaKeluarga} />
    </div>
  );
}