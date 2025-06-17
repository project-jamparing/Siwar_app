import prisma from '@/lib/prisma';
import WargaTable from '@/components/Tables/WargaTable';

export default async function DaftarWargaPage() {
  const warga = await prisma.warga.findMany({
    orderBy: { nama: 'asc' },
  });

  return (
<div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
  <main className="flex-1 p-2 md:p-10 overflow-auto max-w-7xl mx-auto w-full">
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6 md:gap-0">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-800">📋 Daftar Warga Lengkap</h1>
        <p className="mt-1 text-sm text-gray-500">
          Kelola data warga dengan mudah dan cepat.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href="/dashboard/rw/warga/tambah"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-medium px-5 py-2.5 rounded-md shadow transition-all focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Tambah Warga
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