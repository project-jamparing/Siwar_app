'use client';
import React from 'react';

type FormData = {
  id?: number;
  nama: string;
  nominal: string;
  tanggalTempo: string;
  tanggalNagih: string;
  deskripsi: string;
  kategoriId: string;
  status: string;
};

type Props = {
  formData: FormData;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export default function IuranForm({ formData, isEditing, handleChange, handleSubmit }: Props) {
  return (
    <form onSubmit={handleSubmit} className="grid gap-4 bg-gray-50 p-4 rounded shadow">
      <input
        type="text"
        name="nama"
        placeholder="Nama Iuran"
        value={formData.nama}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        type="number"
        name="nominal"
        placeholder="Nominal"
        value={formData.nominal}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        type="date"
        name="tanggalNagih"
        value={formData.tanggalNagih}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="date"
        name="tanggalTempo"
        value={formData.tanggalTempo}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <textarea
        name="deskripsi"
        placeholder="Deskripsi"
        value={formData.deskripsi}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <select
        name="kategoriId"
        value={formData.kategoriId}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">Pilih Kategori</option>
        <option value="1">Keamanan</option>
        <option value="2">Kebersihan</option>
        {/* Tambah kategori sesuai kebutuhan */}
      </select>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="aktif">Aktif</option>
        <option value="tidak_aktif">Tidak Aktif</option>
      </select>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        {isEditing ? 'Update' : 'Simpan'}
      </button>
    </form>
  );
}
