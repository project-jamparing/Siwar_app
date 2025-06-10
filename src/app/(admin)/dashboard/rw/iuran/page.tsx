'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IuranForm from '@/components/IuranForm';
import IuranTable from '@/components/IuranTable';

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

const formatTanggal = (isoDate: string) => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
};

const toInputDate = (isoDate: string) => {
  return isoDate ? new Date(isoDate).toISOString().slice(0, 10) : '';
};

export default function IuranPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    nominal: '',
    tanggalTempo: '',
    tanggalNagih: '',
    deskripsi: '',
    kategoriId: '',
    status: 'aktif',
  });
  const [dataIuran, setDataIuran] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/iuran');
      const data = await res.json();
      setDataIuran(data);
    } catch (err) {
      console.error('Gagal fetch data:', err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: editId,
      nama: formData.nama,
      nominal: Number(formData.nominal),
      tanggal_nagih: formData.tanggalNagih ? new Date(formData.tanggalNagih) : null,
      tanggal_tempo: new Date(formData.tanggalTempo),
      deskripsi: formData.deskripsi,
      kategori_id: formData.kategoriId ? Number(formData.kategoriId) : null,
      status: formData.status || 'aktif',
    };

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/iuran', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      await fetchData();
      resetForm();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Submit error:', err);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      nominal: '',
      tanggalTempo: '',
      tanggalNagih: '',
      deskripsi: '',
      kategoriId: '',
      status: 'aktif',
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      nama: item.nama,
      nominal: item.nominal.toString(),
      tanggalNagih: toInputDate(item.tanggal_nagih),
      tanggalTempo: toInputDate(item.tanggal_tempo),
      deskripsi: item.deskripsi || '',
      kategoriId: item.kategori_id?.toString() || '',
      status: item.status || 'aktif',
    });
    setEditId(item.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/iuran?id=${deleteId}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      await fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Gagal menghapus data');
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 bg-white text-black rounded shadow-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Data Iuran Warga</h1>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Iuran
        </button>
      )}

      {showForm && (
        <>
          <button
            onClick={resetForm}
            className="mb-4 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            ← Kembali ke Tabel
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={isEditing ? 'edit-form' : 'create-form'}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <IuranForm
                formData={formData}
                isEditing={isEditing}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
              />
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          ✅ Data berhasil {isEditing ? 'diupdate' : 'disimpan'}!
        </motion.div>
      )}

      {!showForm && (
        <IuranTable
          data={dataIuran}
          onEdit={handleEdit}
          onDelete={handleDelete}
          formatTanggal={formatTanggal}
        />
      )}

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Apakah Anda yakin ingin menghapus data ini?
              </h2>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
