import prisma from '@/lib/prisma';
import WargaTable from '@/components/WargaTable';

export default async function DaftarWargaPage() {
  const warga = await prisma.warga.findMany({
    orderBy: { nama: 'asc' },
  });

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      <main className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Daftar Warga Lengkap</h1>
        </div>
        <WargaTable warga={warga} />
      </main>
    </div>
  );
}