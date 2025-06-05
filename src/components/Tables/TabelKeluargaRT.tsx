'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface KepalaKeluarga {
  nik: string;
  nama: string;
  no_kk: string;
  kategori: string;
  rt: {
    nama_rt: string;
  };
}

export default function TabelKeluargaRT({ rt_id }: { rt_id: number }) {
  const [data, setData] = useState<KepalaKeluarga[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/warga/kepala-keluarga?rt_id=${rt_id}`);
        const json = await res.json();

        if (json.error) {
          console.error(json.error);
          return;
        }

        setData(json);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      }
    };

    fetchData();
  }, [rt_id]);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md text-gray-900">
      <h2 className="text-2xl font-semibold mb-6">Daftar Kepala Keluarga RT {data[0]?.rt?.nama_rt || ''}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-gray-900">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">No KK</th>
              <th className="border px-4 py-2 text-left">Nama Kepala Keluarga</th>
              <th className="border px-4 py-2 text-left">Kategori</th>
              <th className="border px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Tidak ada data kepala keluarga.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.nik} className="hover:bg-gray-50">
                  <td className="border px-4 py-3">{item.no_kk}</td>
                  <td className="border px-4 py-3">{item.nama}</td>
                  <td className="border px-4 py-3">{item.kategori}</td>
                  <td className="border px-4 py-3 text-center">
                    <Link href={`/dashboard/rt/keluarga/${item.no_kk}`}>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Lihat Detail
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}