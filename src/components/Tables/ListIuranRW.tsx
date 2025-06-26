// src/components/Tables/ListIuranRW.tsx

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TableIuran() {
  const [iurans, setIurans] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('/api/iuran/list');
      setIurans(res.data);
    };

    fetchData();
  }, []);

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}