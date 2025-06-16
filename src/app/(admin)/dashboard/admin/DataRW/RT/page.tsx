"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TableJabatan from "@/components/Tables/TableJabatan";

type Jabatan = {
  id: number;
  nik: string;
  nama_rt: string;
  role_id: number;
  created_at: string;
  updated_at: string;
  status: "aktif" | "nonaktif";
};

export default function DataJabatanPage() {
  const router = useRouter();
  const [data, setData] = useState<Jabatan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/jabatan/list-rt");
      if (!res.ok) throw new Error("Gagal ambil data dari server");
      const json = await res.json();
      setData(json.data ?? []);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const handleNonaktif = async (id: number) => {
    if (!confirm("Yakin nonaktifkan RT ini?")) return;
    setUpdatingId(id);

    try {
      const res = await fetch("/api/jabatan/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "nonaktif" }),
      });
      if (!res.ok) throw new Error("Gagal update status");
      alert("Status RT berhasil di nonaktifkan");
      fetchData();
    } catch (err: any) {
      alert(err.message || "Gagal update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans bg-gray-50 min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Data Masa Jabatan
        </h1>
        <button
          onClick={() => router.push("/dashboard/admin/tambah")}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
          aria-label="Tambah RW/RT"
        >
          + Tambah RW/RT
        </button>
      </header>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && data.length === 0 && <EmptyState />}
      {!loading && !error && data.length > 0 && (
        <TableJabatan
          data={data}
          onNonaktif={handleNonaktif}
          updatingId={updatingId}
        />
      )}
    </div>
  );
}

function Loading() {
  return (
    <p className="text-indigo-600 font-semibold mb-6 animate-pulse text-center">
      Loading data...
    </p>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="text-red-700 font-semibold mb-6 bg-red-100 p-4 rounded-lg shadow-sm">
      {message}
    </p>
  );
}

function EmptyState() {
  return (
    <p className="text-gray-500 text-center text-lg">
      Belum ada data RT yang tersedia.
    </p>
  );
}