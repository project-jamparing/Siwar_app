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
    <div className="flex h-screen bg-gray-50 text-black">
      <main className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Daftar Warga Lengkap</h1>
        </div>
        <WargaTable warga={warga} showActions={false} />
      </main>
    </div>
  );
}