'use client';
import React from 'react';

type FormData = {
  id?: number;
  nama: string;
  nominal: string;
  tanggalNagih: string;
  tanggalTempo: string;
  deskripsi: string;
  kategori_id: string;
  status: 'aktif' | 'nonaktif';
};

type Props = {
  formData: FormData;
  isEditing: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSuccess?: () => void;
};

export default function IuranForm({
  formData,
  isEditing,
  handleChange,
  handleSuccess,
}: Props) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isEditing && formData.id
      ? `/api/iuran/${formData.id}`
      : '/api/iuran';

    const method = isEditing ? 'PUT' : 'POST';

    const dataToSend = {
      ...(isEditing && formData.id ? { id: formData.id } : {}),
      nama: formData.nama,
      nominal: parseFloat(formData.nominal),
      tanggalNagih: formData.tanggalNagih,
      tanggalTempo: formData.tanggalTempo,
      deskripsi: formData.deskripsi,
      kategori_id: parseInt(formData.kategori_id),
      status: formData.status,
    };

    if (!formData.nama.trim()) {
      alert("Nama wajib diisi!");
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Gagal: ${result.message}`);
        return;
      }

      alert(result.message);
      if (handleSuccess) handleSuccess();
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan jaringan');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div>
        <label className="block font-semibold mb-1">Nama</label>
        <input
          type="text"
          name="nama"
          value={formData.nama || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Tanggal Nagih</label>
        <input
          type="date"
          name="tanggalNagih"
          value={formData.tanggalNagih || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Tanggal Tempo</label>
        <input
          type="date"
          name="tanggalTempo"
          value={formData.tanggalTempo || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Nominal</label>
        <input
          type="number"
          name="nominal"
          value={formData.nominal || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Deskripsi</label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Kategori</label>
        <input
          type="number"
          name="kategori_id"
          value={formData.kategori_id || ''}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Status</label>
        <select
          name="status"
          value={formData.status || 'aktif'}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {isEditing ? 'Update' : 'Simpan'}
      </button>
    </form>
  );
}
