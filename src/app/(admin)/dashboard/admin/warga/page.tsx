import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function DaftarWargaPage() {
  const warga = await prisma.warga.findMany({
    orderBy: { nama: 'asc' },
  });

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      <main className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Daftar Warga Lengkap</h1>
          <Link
            href="/dashboard/admin/warga/tambah"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            + Tambah Warga
          </Link>
        </div>

        <div className="overflow-x-auto">
            <div className="inline-block min-w-full overflow-hidden rounded-md border border-gray-300 shadow">
              <table className="min-w-full text-sm text-left bg-white">
                <thead className="bg-blue-100 text-gray-800">
                  <tr>
                    <th className="border px-4 py-2">NIK</th>
                    <th className="border px-4 py-2">Nama</th>
                    <th className="border px-4 py-2">Tempat Lahir</th>
                    <th className="border px-4 py-2">Tanggal Lahir</th>
                    <th className="border px-4 py-2">Agama</th>
                    <th className="border px-4 py-2">Status Kawin</th>
                    <th className="border px-4 py-2">Pekerjaan</th>
                    <th className="border px-4 py-2">Golongan Darah</th>
                    <th className="border px-4 py-2">Kewarganegaraan</th>
                  </tr>
                </thead>
                <tbody>
                  {warga.map((w) => (
                    <tr key={w.nik} className="hover:bg-yellow-50 transition-colors">
                      <td className="border px-4 py-2">{w.nik}</td>
                      <td className="border px-4 py-2">{w.nama}</td>
                      <td className="border px-4 py-2">{w.tempat_lahir || '-'}</td>
                      <td className="border px-4 py-2">{w.tanggal_lahir?.toLocaleDateString() || '-'}</td>
                      <td className="border px-4 py-2">{w.agama || '-'}</td>
                      <td className="border px-4 py-2">
                        {w.status_perkawinan === 'kawin_tercatat'
                          ? 'Kawin'
                          : w.status_perkawinan === 'belum_kawin'
                          ? 'Belum Kawin'
                          : '-'}
                      </td>
                      <td className="border px-4 py-2">{w.jenis_pekerjaan || '-'}</td>
                      <td className="border px-4 py-2">{w.golongan_darah || '-'}</td>
                      <td className="border px-4 py-2">{w.kewarganegaraan || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

      </main>
    </div>
  );
}
