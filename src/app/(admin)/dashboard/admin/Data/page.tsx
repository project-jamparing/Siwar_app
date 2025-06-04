"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Jabatan = {
  id: number;
  nik: string;
  nama_rt: string;
  role_id: number;
  created_at: string;
  updated_at: string;
  status: "aktif" | "nonaktif";
};

export default function DataJabatan() {
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
          Dashboard Jabatan
        </h1>
        <button
          onClick={() => router.push("/dashboard/admin/tambah")}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
          aria-label="Tambah RW/RT"
        >
          + Tambah RW/RT
        </button>
      </header>

      {loading && (
        <p className="text-indigo-600 font-semibold mb-6 animate-pulse text-center">
          Loading data...
        </p>
      )}

      {error && (
        <p className="text-red-700 font-semibold mb-6 bg-red-100 p-4 rounded-lg shadow-sm">
          {error}
        </p>
      )}

      {!loading && !error && data.length === 0 && (
        <p className="text-gray-500 text-center text-lg">Belum ada data RT yang tersedia.</p>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md bg-white">
          <table className="w-full table-auto text-left text-sm text-gray-700">
            <thead className="bg-indigo-600 text-white uppercase text-xs tracking-wider select-none">
              <tr>
                <th className="px-6 py-3">NIK</th>
                <th className="px-6 py-3">Nama RT</th>
                <th className="px-6 py-3">Jabatan</th>
                <th className="px-6 py-3">Dilantik</th>
                <th className="px-6 py-3">Pelengseran</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((jabatan, i) => (
                <tr
                  key={jabatan.id}
                  className={`border-b ${
                    i % 2 === 0 ? "bg-white" : "bg-indigo-50"
                  } ${jabatan.status === "nonaktif" ? "opacity-60 italic" : ""} hover:bg-indigo-100 transition`}
                >
                  <td className="px-6 py-4 font-mono text-gray-900">{jabatan.nik}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{jabatan.nama_rt}</td>
                  <td className="px-6 py-4 text-center text-gray-700 font-medium">
                    {jabatan.role_id === 1
                      ? "Admin"
                      : jabatan.role_id === 2
                      ? "RW"
                      : jabatan.role_id === 3
                      ? "RT"
                      : jabatan.role_id === 4
                      ? "Warga"
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(jabatan.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {jabatan.status === "nonaktif"
                      ? new Date(jabatan.updated_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        jabatan.status === "aktif"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {jabatan.status === "aktif" ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {jabatan.status === "aktif" ? (
                      <button
                        disabled={updatingId === jabatan.id}
                        onClick={() => handleNonaktif(jabatan.id)}
                        className={`rounded-md px-4 py-2 text-white font-semibold transition duration-200 ${
                          updatingId === jabatan.id
                            ? "bg-red-800 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {updatingId === jabatan.id ? "Memproses..." : "Nonaktifkan"}
                      </button>
                    ) : (
                      <span className="italic text-gray-400 select-none text-sm">Tidak ada aksi</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}