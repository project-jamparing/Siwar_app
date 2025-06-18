import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function WargaPage() {
  const cookie = await cookies();
  const nik = cookie.get('nik')?.value;

  if (!nik) {
    redirect('/login');
  }

  const user = await prisma.user.findFirst({
    where: { nik },
    include: { warga: true },
  });

  if (!user || user.role_id !== 4) {
    redirect('/login');
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pengumuman?terbaru=true&role=warga&nik=${nik}`, {
    cache: 'no-store',
  });

  const pengumumanTerbaru = await res.json();

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <p className="text-gray-700">
        Selamat datang, <span className="font-semibold">{user.warga?.nama ?? user.nik}</span>. Silakan akses informasi iuran dan pengumuman melalui menu di sebelah kiri.
      </p>

      {/* Pengumuman Terbaru */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pengumuman Terbaru</h2>
        <div className="space-y-3">
          {pengumumanTerbaru.length === 0 ? (
            <p className="text-gray-500">Tidak ada pengumuman 2 hari terakhir</p>
          ) : (
            pengumumanTerbaru.map((item: any) => (
              <div key={item.id} className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="font-semibold text-indigo-700">{item.judul}</h3>
                <p className="text-gray-600 text-sm">{item.subjek}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
