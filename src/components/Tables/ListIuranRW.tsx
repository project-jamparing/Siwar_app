'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function TableIuran() {
  const [iurans, setIurans] = useState<any[]>([]);
  const router = useRouter();

  const fetchData = async () => {
    const res = await axios.get('/api/iuran/list');
    setIurans(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('Yakin ingin menghapus iuran ini?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/iuran/${id}`);
      alert('Iuran berhasil dihapus');
      fetchData();
    } catch (error) {
      alert('Gagal menghapus iuran');
    }
  };

  const handleNonaktifkan = async (id: number) => {
    const confirmNonaktif = confirm('Yakin ingin menonaktifkan iuran ini?');
    if (!confirmNonaktif) return;

    try {
      await axios.patch(`/api/iuran/${id}/nonaktifkan`);
      alert('Iuran berhasil dinonaktifkan');
      fetchData();
    } catch (error) {
      alert('Gagal menonaktifkan iuran');
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-300 rounded-lg shadow-sm text-black">
        <thead className="bg-gray-100 text-black">
          <tr>
            <th className="border px-4 py-2 text-left">Nama</th>
            <th className="border px-4 py-2 text-left">Deskripsi</th>
            <th className="border px-4 py-2 text-left">Nominal</th>
            <th className="border px-4 py-2 text-left">Tanggal Nagih</th>
            <th className="border px-4 py-2 text-left">Tanggal Tempo</th>
            <th className="border px-4 py-2 text-left">Kategori</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-black">
          {iurans.map((iuran, index) => (
            <tr
              key={iuran.id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
            >
              <td className="border px-4 py-2">{iuran.nama}</td>
              <td className="border px-4 py-2">{iuran.deskripsi}</td>
              <td className="border px-4 py-2">Rp {iuran.nominal.toLocaleString()}</td>
              <td className="border px-4 py-2">
                {new Date(iuran.tanggal_nagih).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                {new Date(iuran.tanggal_tempo).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">{iuran.kategori?.nama}</td>
              <td className="border px-4 py-2 capitalize">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    iuran.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {iuran.status}
                </span>
              </td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => router.push(`/dashboard/rw/iuran/edit/${iuran.id}`)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(iuran.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                >
                  Hapus
                </button>
                <button
                  onClick={() => handleNonaktifkan(iuran.id)}
                  disabled={iuran.status === 'nonaktif'}
                  className={`${
                    iuran.status === 'nonaktif'
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gray-500 hover:bg-gray-600'
                  } text-white px-3 py-1 rounded text-xs`}
                >
                  Nonaktifkan
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
