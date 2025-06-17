import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import WargaTable from '@/components/Tables/WargaTable';

export default async function DaftarWargaPage() {
  const cookieStore = await cookies();
  const nik = cookieStore.get('nik')?.value;

  let warga = [];

  if (nik) {
    const user = await prisma.user.findUnique({
      where: { nik },
      include: {
        warga: {
          include: {
            kk: true,
          },
        },
      },
    });

    const rtId = user?.warga?.kk?.rt_id;
    const roleId = user?.role_id;

    if (roleId === 3 && rtId) {
      warga = await prisma.warga.findMany({
        where: {
          kk: {
            rt_id: rtId,
          },
        },
        orderBy: { nama: 'asc' },
      });
    } else {
      warga = await prisma.warga.findMany({
        orderBy: { nama: 'asc' },
      });
    }
  }

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
            {/* Placeholder for filters / buttons */}
            {/* Contoh: <Button>Export</Button> */}
          </div>
        </header>

        <section className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <WargaTable warga={warga} showActions={false} />
        </section>
      </main>
    </div>
  );
}