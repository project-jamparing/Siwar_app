'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FormData = {
  id?: number;
  nama: string;
  nominal: string;
  tanggalTagih: string;
  tanggalTempo: string;
};

const formatTanggal = (isoDate: string) => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`; // Format DD-MM-YY
};

const toInputDate = (isoDate: string) => {
  if (!isoDate) return '';
  return new Date(isoDate).toISOString().slice(0, 10);
};

const parseNominal = (str: string) => {
  return Number(str.replace(/[^\d]/g, ''));
};

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

const formatNominalInput = (num: number) => {
  return num.toString(); // Kembalikan sebagai string tanpa format
};

const Iuran = () => {
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    nominal: '',
    tanggalTagih: '',
    tanggalTempo: '',
  });

  const [dataIuran, setDataIuran] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/iuran');
        const data = await res.json();
        setDataIuran(data);
      } catch (err) {
        console.error('Gagal fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'nominal') {
      // Hanya biarkan angka dan hapus semua karakter non-digit
      const clean = value.replace(/[^\d]/g, '');
      setFormData({ ...formData, [name]: clean });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nominalNumber = parseNominal(formData.nominal);

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? '/api/iuran' : '/api/iuran';
      const body = isEditing
        ? JSON.stringify({
            id: editId,
            nama: formData.nama,
            nominal: nominalNumber,
            tanggalTagih: formData.tanggalTagih,
            tanggalTempo: formData.tanggalTempo,
          })
        : JSON.stringify({
            nama: formData.nama,
            nominal: nominalNumber,
            tanggal_tagih: formData.tanggalTagih,
            tanggal_tempo: formData.tanggalTempo,
          });

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (res.ok) {
        const updated = await fetch('/api/iuran');
        const newData = await updated.json();
        setDataIuran(newData);
        setShowSaveConfirm(true);
        setTimeout(() => setShowSaveConfirm(false), 2000);
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan');
    } finally {
      setFormData({
        nama: '',
        nominal: '',
        tanggalTagih: '',
        tanggalTempo: '',
      });
      setIsEditing(false);
      setEditId(null);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      id: item.id,
      nama: item.nama,
      nominal: item.nominal.toString(), // Simpan nilai asli tanpa format
      tanggalTagih: toInputDate(item.tanggalTagih),
      tanggalTempo: toInputDate(item.tanggalTempo),
    });
    setEditId(item.id ?? null);
    setIsEditing(true);
  };

  const handleDelete = (id?: number) => {
    if (!id) return;
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/iuran?id=${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const updated = await fetch('/api/iuran');
        const newData = await updated.json();
        setDataIuran(newData);
      }
    } catch (error) {
      console.error('Hapus error:', error);
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 bg-white text-black rounded shadow-md max-w-4xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-4">Data Iuran Warga</h1>


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
            {dataIuran.map((item, index) => (
              <tr key={index} className="bg-white hover:bg-gray-50">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{item.nama}</td>
                <td className="px-4 py-2 border">
                  {formatRupiah(parseInt(item.nominal))}
                </td>
                <td className="px-4 py-2 border">{formatTanggal(item.tanggalTagih)}</td>
                <td className="px-4 py-2 border">{formatTanggal(item.tanggalTempo)}</td>
                <td className="px-4 py-2 border text-center space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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

      {/* Modal Konfirmasi Hapus - Tanpa overlay */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center border border-gray-300">
              <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus</h2>
              <p className="mb-6">Apakah Anda yakin ingin menghapus data ini?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Hapus
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifikasi Simpan/Edit */}
      <AnimatePresence>
        {showSaveConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-semibold">
                {isEditing ? 'Data Berhasil Diupdate!' : 'Data Berhasil Disimpan!'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Iuran;