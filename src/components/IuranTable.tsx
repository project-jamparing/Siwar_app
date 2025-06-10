'use client';
import React from 'react';

type Props = {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  formatTanggal: (iso: string) => string;
};

export default function IuranTable({ data, onEdit, onDelete, formatTanggal }: Props) {
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-4 py-2">Nama</th>
          <th className="border px-4 py-2">Nominal</th>
          <th className="border px-4 py-2">Tanggal Nagih</th>
          <th className="border px-4 py-2">Tanggal Tempo</th>
          <th className="border px-4 py-2">Deskripsi</th>
          <th className="border px-4 py-2">Kategori</th>
          <th className="border px-4 py-2">Status</th>
          <th className="border px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="text-center">
            <td className="border px-4 py-2">{item.nama}</td>
            <td className="border px-4 py-2">{item.nominal}</td>
            <td className="border px-4 py-2">{formatTanggal(item.tanggal_nagih)}</td>
            <td className="border px-4 py-2">{formatTanggal(item.tanggal_tempo)}</td>
            <td className="border px-4 py-2">{item.deskripsi}</td>
            <td className="border px-4 py-2">{item.kategori?.nama || '-'}</td>
            <td className="border px-4 py-2">{item.status}</td>
            <td className="border px-4 py-2 space-x-2">
              <button
                onClick={() => onEdit(item)}
                className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
