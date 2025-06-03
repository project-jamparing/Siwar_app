'use client';
import React from 'react';

type IuranItem = {
  id: number;
  nama: string;
  nominal: number;
  tanggalNagih: string;
  tanggalTempo: string;
  deskripsi: string;
  kategori_id: number;
  status: 'aktif' | 'nonaktif';
};

type Props = {
  data: IuranItem[];
  onEdit: (item: IuranItem) => void;
  onDelete: (id: number) => void;
  formatTanggal: (isoDate: string) => string;
};

export default function IuranTable({ data, onEdit, onDelete, formatTanggal }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 border">No</th>
            <th className="px-4 py-2 border">Nama</th>
            <th className="px-4 py-2 border">Nominal</th>
            <th className="px-4 py-2 border">Nagih</th>
            <th className="px-4 py-2 border">Tempo</th>
            <th className="px-4 py-2 border">Deskripsi</th>
            <th className="px-4 py-2 border">Kategori</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id} className="bg-white">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{item.nama}</td>
                <td className="px-4 py-2 border">Rp{Number(item.nominal).toLocaleString()}</td>
                <td className="px-4 py-2 border">{formatTanggal(item.tanggalNagih)}</td>
                <td className="px-4 py-2 border">{formatTanggal(item.tanggalTempo)}</td>
                <td className="px-4 py-2 border">{item.deskripsi}</td>
                <td className="px-4 py-2 border">{item.kategori_id}</td>
                <td className="px-4 py-2 border capitalize">{item.status}</td>
                <td className="px-4 py-2 border text-center space-x-2">
                  <button onClick={() => onEdit(item)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => onDelete(item.id)} className="text-red-600 hover:underline">Hapus</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center px-4 py-4 border text-gray-500">
                Belum ada data iuran
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
