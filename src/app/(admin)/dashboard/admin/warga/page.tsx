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

        <div className="w-full overflow-x-auto">
          <div className="min-w-max inline-block align-middle">
            <table className="table-auto border text-xs sm:text-sm bg-white shadow rounded text-black w-60px">
              <thead className="bg-gray-100 sticky top-0 z-10 text-black">
                <tr>
                  <th className="border px-4 py-2">NIK</th>
                  <th className="border px-4 py-2">Nama</th>
                  <th className="border px-4 py-2">No KK</th>
                  <th className="border px-4 py-2">Jenis Kelamin</th>
                  <th className="border px-4 py-2">Tempat Lahir</th>
                  <th className="border px-4 py-2">Tanggal Lahir</th>
                  <th className="border px-4 py-2">Agama</th>
                  <th className="border px-4 py-2">Pendidikan</th>
                  <th className="border px-4 py-2">Pekerjaan</th>
                  <th className="border px-4 py-2">Golongan Darah</th>
                  <th className="border px-4 py-2">Status Kawin</th>
                  <th className="border px-4 py-2">Tgl Kawin</th>
                  <th className="border px-4 py-2">Status Hubungan</th>
                  <th className="border px-4 py-2">Kewarganegaraan</th>
                  <th className="border px-4 py-2">No Paspor</th>
                  <th className="border px-4 py-2">No KITAP</th>
                  <th className="border px-4 py-2">Ayah</th>
                  <th className="border px-4 py-2">Ibu</th>
                </tr>
              </thead>
              <tbody>
                {warga.map((w) => (
                  <tr key={w.nik} className="hover:bg-yellow-50">
                    <td className="border px-4 py-2">{w.nik}</td>
                    <td className="border px-4 py-2">{w.nama}</td>
                    <td className="border px-4 py-2">{w.no_kk || '-'}</td>
                    <td className="border px-4 py-2">{w.jenis_kelamin.replace('_', ' ')}</td>
                    <td className="border px-4 py-2">{w.tempat_lahir || '-'}</td>
                    <td className="border px-4 py-2">{w.tanggal_lahir?.toLocaleDateString() || '-'}</td>
                    <td className="border px-4 py-2">{w.agama || '-'}</td>
                    <td className="border px-4 py-2">{w.pendidikan || '-'}</td>
                    <td className="border px-4 py-2">{w.jenis_pekerjaan || '-'}</td>
                    <td className="border px-4 py-2">{w.golongan_darah || '-'}</td>
                    <td className="border px-4 py-2">{w.status_perkawinan || '-'}</td>
                    <td className="border px-4 py-2">{w.tanggal_perkawinan?.toLocaleDateString() || '-'}</td>
                    <td className="border px-4 py-2">{w.status_hubungan_dalam_keluarga || '-'}</td>
                    <td className="border px-4 py-2">{w.kewarganegaraan || '-'}</td>
                    <td className="border px-4 py-2">{w.no_paspor || '-'}</td>
                    <td className="border px-4 py-2">{w.no_kitap || '-'}</td>
                    <td className="border px-4 py-2">{w.ayah || '-'}</td>
                    <td className="border px-4 py-2">{w.ibu || '-'}</td>
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