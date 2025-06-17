import prisma from '@/lib/prisma';
import WargaTable from '@/components/Tables/WargaTable';

export default async function DaftarWargaPage() {
  const warga = await prisma.warga.findMany({
    orderBy: { nama: 'asc' },
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
      <main className="flex-1 p-4 md:p-10 overflow-auto max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
              📋 Daftar Warga Lengkap
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Semua data warga ditampilkan dengan urutan abjad.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Placeholder for filters / buttons */}
            {/* Contoh: <Button>Export</Button> */}
          </div>
        </header>

        <section className="bg-white dark:bg-gray-900 rounded-xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-800 p-4 md:p-6">
          <WargaTable warga={warga} showActions={false} />
        </section>
      </main>
    </div>
  );
}