'use client';
import React, { useEffect, useState } from 'react';
import IuranForm from '@/components/IuranForm';
import IuranTable from '@/components/IuranTable';

type IuranItem = {
  id: number;
  nama: string;
  nominal: number;
  tanggalTagih: string;
  tanggalTempo: string;
};

const initialFormData = {
  nama: '',
  nominal: '',
  tanggalTagih: '',
  tanggalTempo: '',
};

export default function IuranPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [data, setData] = useState<IuranItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Ambil data dari API
  const fetchData = async () => {
    const res = await fetch('/api/iuran');
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Edit data
  const handleEdit = (item: IuranItem) => {
    setFormData({
      nama: item.nama,
      nominal: item.nominal.toString(),
      tanggalTagih: item.tanggalTagih,
      tanggalTempo: item.tanggalTempo,
    });
    setIsEditing(true);
    setEditId(item.id);
  };

  // Hapus data
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;

    const res = await fetch(`/api/iuran?id=${id}`, { method: 'DELETE' });
    const result = await res.json();
    alert(result.message);

    if (res.ok) {
      fetchData();
    }
  };

  // Format tanggal
  const formatTanggal = (iso: string) => {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Iuran Warga</h1>

      <IuranForm
        formData={{ ...formData, id: editId ?? undefined }}
        isEditing={isEditing}
        handleChange={handleChange}
        handleSuccess={() => {
          setFormData(initialFormData);
          setIsEditing(false);
          setEditId(null);
          fetchData();
        }}
      />

      <IuranTable
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        formatTanggal={formatTanggal}
      />
    </div>
  );
}
