import prisma from '@/lib/prisma';
import WargaTable from '@/components/WargaTable';

export default async function DaftarWargaPage() {
  const warga = await prisma.warga.findMany({
    orderBy: { nama: 'asc' },
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <main className="flex-1 p-6 md:p-10 overflow-auto max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 md:gap-0">
          <h1 className="text-3xl font-extrabold tracking-tight">Daftar Warga Lengkap</h1>
          <div className="flex flex-wrap gap-3">
            <a
              href="/dashboard/rw/warga/tambah"
              className="inline-block bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-semibold px-5 py-2 rounded-md transition-shadow shadow-md focus:outline-none"
            >
              + Tambah Warga
            </a>
          </div>
        </header>

        <section className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <WargaTable warga={warga} showActions={true} />
        </section>
      </main>
    </div>
  );
}