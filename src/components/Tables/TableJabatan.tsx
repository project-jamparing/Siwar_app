"use client";

import React, { useMemo, useState } from "react";

type Jabatan = {
  id: number;
  nik: string;
  nama_rt: string;
  role_id: number;
  created_at: string;
  updated_at: string;
  status: "aktif" | "nonaktif";
  rukun_tetangga_nama: string;
};

type Props = {
  data: Jabatan[];
  onNonaktif: (id: number) => void;
  updatingId: number | null;
};

export default function TableJabatan({ data, onNonaktif, updatingId }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const getRoleName = (role_id: number) => {
    switch (role_id) {
      case 1:
        return "Admin";
      case 2:
        return "RW";
      case 3:
        return "RT";
      case 4:
        return "Warga";
      default:
        return "-";
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.nik.toLowerCase().includes(search.toLowerCase()) ||
      item.nama_rt.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <>
      {/* Search + Limit */}
      <div className="flex flex-col space-y-4 mb-4 md:flex-row md:items-center md:justify-between md:space-y-0 text-gray-700">
        <input
          type="text"
          placeholder="Cari NIK atau Nama ..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-md text-sm w-full md:w-64"
        />

        <div className="flex items-center gap-2 text-gray-700">
          <label htmlFor="limit" className="text-sm text-gray-700">
            Tampilkan:
          </label>
          <select
            id="limit"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded-md text-sm"
          >
            {[5, 10, 20, 50, 100].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md bg-white">
        <table className="w-full table-auto text-left text-sm text-gray-700 [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2">
          <thead className="bg-indigo-600 text-white uppercase text-xs tracking-wider select-none">
            <tr>
              <th>NIK</th>
              <th>Nama</th>
              <th>Jabatan</th>
              <th>Dilantik</th>
              <th>Masa Bakti</th>
              <th>Status</th>
              <th>RT</th>
              <th className="text-center">Aksi</th>
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
                  <td className="font-mono text-gray-900">{jabatan.nik}</td>
                  <td className="font-semibold text-gray-800">{jabatan.nama_rt}</td>
                  <td className="text-center text-gray-700 font-medium">
                    {getRoleName(jabatan.role_id)}
                  </td>
                  <td className="text-gray-600">
                    {new Date(jabatan.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="text-gray-600">
                    {jabatan.status === "nonaktif"
                      ? new Date(jabatan.updated_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td>
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
                  <td className="text-gray-700 font-medium">
                    {jabatan.rukun_tetangga_nama}
                  </td>
                  <td className="text-center">
                    {jabatan.status === "aktif" ? (
                      <button
                        type="button"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2 flex-wrap">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                type="button"
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
            type="button"
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