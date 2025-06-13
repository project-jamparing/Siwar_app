'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Trash, Pencil } from 'lucide-react';
import EditKKForm from '@/components/Forms/EditKKForm';

interface KepalaKeluarga {
  nik: string;
  nama: string;
  no_kk: string;
  rt: string;
  kategori: string;
}

export default function TabelKeluarga() {
  const [data, setData] = useState<KepalaKeluarga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const [selectedKK, setSelectedKK] = useState<KepalaKeluarga | null>(null);
  const [refresh, setRefresh] = useState(false); // trigger useEffect

  const handleEdit = (kk: KepalaKeluarga) => {
    setSelectedKK(kk);
  };

  const handleSuccess = () => {
    setRefresh((prev) => !prev); // untuk trigger fetch ulang
  };

  // Ambil role user
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error('Gagal mengambil role pengguna');
        const json = await res.json();
        setRole(json.role);
      } catch (err: any) {
        console.error('Gagal ambil role:', err);
        setRole('rw'); // fallback
      }
    };

    fetchRole();
  }, []);

  // Ambil data kepala keluarga (refresh juga)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/warga/kepala-keluarga');
        if (!res.ok) throw new Error('Gagal mengambil data');

        const json = await res.json();
        if (json.error) {
          setError(json.error);
          setData([]);
        } else {
          setData(json);
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleDelete = async (no_kk: string) => {
    const konfirmasi = confirm(`Yakin ingin menghapus KK ${no_kk}?`);
    if (!konfirmasi) return;

    try {
      const res = await fetch('/api/kk/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ no_kk }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(`Gagal menghapus: ${json.error || 'Terjadi kesalahan'}`);
      } else {
        alert(`✅ ${json.message}`);
        setRefresh((prev) => !prev); // refresh tabel
      }
    } catch (err: any) {
      alert(`Gagal: ${err.message}`);
    }
  };

  return (
    <>
      {selectedKK && (
        <EditKKForm
          kk={selectedKK}
          onClose={() => setSelectedKK(null)}
          onSuccess={handleSuccess}
        />
      )}

      <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md text-gray-800">
        <h2 className="text-3xl font-bold mb-6">📋 Daftar Kartu Keluarga</h2>

        {loading ? (
          <p className="text-center py-6 text-gray-500">Memuat data...</p>
        ) : error ? (
          <p className="text-center py-6 text-red-600">Error: {error}</p>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-left text-gray-600 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-4 py-3">No KK</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">RT</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      Tidak ada data kepala keluarga
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.no_kk} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 border-t border-gray-200">{item.no_kk}</td>
                      <td className="px-4 py-3 border-t border-gray-200">{item.nama}</td>
                      <td className="px-4 py-3 border-t border-gray-200">{item.rt}</td>
                      <td className="px-4 py-3 border-t border-gray-200 capitalize">{item.kategori}</td>
                      <td className="px-4 py-3 border-t border-gray-200 text-center flex justify-center gap-2 flex-wrap">
                        <Link href={`/dashboard/${role}/keluarga/${item.no_kk}`}>
                          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm">
                            <Eye className="w-4 h-4" />
                            Lihat
                          </button>
                        </Link>

                        {(role === 'rw' || role === 'admin') && (
                          <>
                            <button
                              onClick={() => handleEdit(item)}
                              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm"
                            >
                              <Pencil className="w-4 h-4" /> Edit
                            </button>

                            <button
                              onClick={() => handleDelete(item.no_kk)}
                              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm"
                            >
                              <Trash className="w-4 h-4" /> Hapus
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}