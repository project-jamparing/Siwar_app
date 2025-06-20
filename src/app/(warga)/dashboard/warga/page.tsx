import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Megaphone, CheckCircle, AlertCircle, Layers3 } from 'lucide-react';
import Link from 'next/link';
import { pengumuman } from '@prisma/client';
export default async function WargaPage() {
  const cookie = await cookies();
  const nik = cookie.get('nik')?.value;

  if (!nik) {
    redirect('/login');
  }

  const user = await prisma.user.findFirst({
    where: { nik },
    include: {
      warga: {
        include: {
          kk: true,
        },
      },
    },
  });

  if (!user || user.role_id !== 4) {
    redirect('/login');
  }

  const userName = user.warga?.nama || user.nik;
  const kategoriId = user.warga?.kk?.kategori_id;

  let kategori = null;
  if (kategoriId) {
    kategori = await prisma.kategori.findUnique({ where: { id: kategoriId } });
  }

  const statusIuran = 'Lunas';

  // Ambil pengumuman terbaru
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pengumuman?terbaru=true&role=warga&nik=${nik}`, {
    cache: 'no-store',
  });

  const json = await res.json();
  const pengumuman = json.data || [];

  return (
    <main className="flex-1 p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Selamat Datang, <span className="text-blue-800">{userName}</span>
        </h2>
        <p className="text-sm text-gray-500">Semoga harimu menyenangkan! 🌞</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 flex items-center gap-4 hover:shadow-lg transition">
          <Layers3 className="w-10 h-10 text-indigo-500" />
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Kategori</h3>
            <p className="text-lg font-semibold text-gray-700">{kategori?.nama || 'Belum Ditentukan'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 flex items-center gap-4 hover:shadow-lg transition">
          {statusIuran === 'Lunas' ? (
            <CheckCircle className="w-10 h-10 text-green-500" />
          ) : (
            <AlertCircle className="w-10 h-10 text-red-500" />
          )}
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Status Iuran</h3>
            <p className="text-lg font-semibold text-gray-700">{statusIuran}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 flex items-center gap-4 hover:shadow-lg transition">
          <Megaphone className="w-10 h-10 text-yellow-500" />
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Pengumuman Aktif</h3>
            <p className="text-lg font-semibold text-gray-700">{pengumuman.length}</p>
          </div>
        </div>
      </div>
      {/* Pengumuman Terbaru */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pengumuman Terbaru</h2>
        <div className="space-y-3">
          {pengumuman.length === 0 ? (
            <p className="text-gray-500">Tidak ada pengumuman 2 hari terakhir</p>
          ) : (
            pengumuman.map((item: pengumuman) => (
              <Link
                key={item.id}
                href={`/dashboard/warga/pengumuman?selected=${item.id}`}
                className="block"
              >
                <div className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                  <h3 className="font-semibold text-indigo-700">{item.judul}</h3>
                  <p className="text-gray-600 text-sm">{item.subjek}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
