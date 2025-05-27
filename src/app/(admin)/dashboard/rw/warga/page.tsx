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
          <a
            href="/dashboard/admin/warga/tambah"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            + Tambah Warga
          </a>
        </div>
        <WargaTable warga={warga} />
      </main>
    </div>
  );
}