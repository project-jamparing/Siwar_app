import React from 'react';

interface TableIuranProps {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id?: number) => void;
  formatRupiah: (num: number) => string;
  formatTanggal: (isoDate: string) => string;
}

export default function TableIuran({
  data,
  onEdit,
  onDelete,
  formatRupiah,
  formatTanggal
}: TableIuranProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 border">No</th>
            <th className="px-4 py-2 border">Nama</th>
            <th className="px-4 py-2 border">Nominal</th>
            <th className="px-4 py-2 border">Tagih</th>
            <th className="px-4 py-2 border">Tempo</th>
            <th className="px-4 py-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id || index} className="bg-white hover:bg-gray-50">
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{item.nama}</td>
              <td className="px-4 py-2 border">
                {formatRupiah(Number(item.nominal))}
              </td>
              <td className="px-4 py-2 border">
                {formatTanggal(item.tanggal_tagih)}
              </td>
              <td className="px-4 py-2 border">
                {formatTanggal(item.tanggal_tempo)}
              </td>
              <td className="px-4 py-2 border text-center space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
