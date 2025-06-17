"use client";

import React, { useMemo, useState } from "react";

type Jabatan = {
  id: number;
  nik: string;
  nama_rt: string; // nama warga
  role_id: number;
  created_at: string;
  updated_at: string;
  status: "aktif" | "nonaktif";
  rukun_tetangga_nama: string; // nama RT dari tabel rukun_tetangga
};

type Props = {
  data: Jabatan[];
  onNonaktif: (id: number) => void;
  updatingId: number | null;
};

export default function TableJabatan({ data, onNonaktif, updatingId }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage]);

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md bg-white">
        <table className="w-full table-auto text-left text-sm text-gray-700">
          <thead className="bg-indigo-600 text-white uppercase text-xs tracking-wider select-none">
            <tr>
              <th className="px-6 py-3">NIK</th>
              <th className="px-6 py-3">Nama</th>
              <th className="px-6 py-3">Jabatan</th>
              <th className="px-6 py-3">Dilantik</th>
              <th className="px-6 py-3">Pelengseran</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">RT</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  Tidak ada data jabatan.
                </td>
              </tr>
            ) : (
              paginatedData.map((jabatan, i) => (
                <tr
                  key={jabatan.id}
                  className={`border-b ${
                    i % 2 === 0 ? "bg-white" : "bg-indigo-50"
                  } ${
                    jabatan.status === "nonaktif" ? "opacity-60 italic" : ""
                  } hover:bg-indigo-100 transition`}
                >
                  <td className="px-6 py-4 font-mono text-gray-900">
                    {jabatan.nik}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {jabatan.nama_rt}
                  </td>
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
                      ? new Date(jabatan.updated_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
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
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {jabatan.rukun_tetangga_nama}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {jabatan.status === "aktif" ? (
                      <button
                        disabled={updatingId === jabatan.id}
                        onClick={() => onNonaktif(jabatan.id)}
                        className={`rounded-md px-4 py-2 text-white font-semibold transition duration-200 ${
                          updatingId === jabatan.id
                            ? "bg-red-800 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {updatingId === jabatan.id
                          ? "Memproses..."
                          : "Nonaktifkan"}
                      </button>
                    ) : (
                      <span className="italic text-gray-400 select-none text-sm">
                        Tidak ada aksi
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination angka + Prev Next */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-3 py-1 rounded ${
                  currentPage === pageNumber
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {pageNumber}
              </button>
            )
          )}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}