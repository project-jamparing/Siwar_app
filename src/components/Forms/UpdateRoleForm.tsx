"use client";

import { useState } from "react";
import BackButton from "../Buttons/BackButton";

const roleOptions = [
  { id: 1, label: "Admin" },
  { id: 2, label: "RW" },
  { id: 3, label: "RT" },
];

export default function UpdateRoleForm() {
  const [nik, setNik] = useState("");
  const [roleId, setRoleId] = useState(4);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });

  const handleUpdate = async () => {
    if (!nik.trim()) {
      setMessage({ text: "NIK wajib diisi.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/user/update-role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nik, newRoleId: roleId }),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Gagal update");

      setMessage({ text: "✅ Role berhasil diupdate!", type: "success" });
      setNik("");
      setRoleId(4);
    } catch (error: any) {
      setMessage({ text: "❌ " + error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-3xl shadow-lg ring-1 ring-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">Update Role Pengguna</h2>
      <BackButton />
      <label className="block mb-2 font-medium text-gray-700" htmlFor="nik">
        NIK
      </label>
      <input
        id="nik"
        type="text"
        value={nik}
        onChange={(e) => setNik(e.target.value)}
        placeholder="Masukkan NIK"
        className="w-full px-4 py-3 mb-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900"
      />

      <label className="block mb-2 font-medium text-gray-700" htmlFor="role">
        Jabatan Baru
      </label>
      <select
        id="role"
        value={roleId}
        onChange={(e) => setRoleId(Number(e.target.value))}
        className="w-full px-4 py-3 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900"
      >
        <option value={4} disabled>
          Pilih Jabatan
        </option>
        {roleOptions.map((role) => (
          <option key={role.id} value={role.id}>
            {role.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className={`w-full py-3 rounded-xl text-white font-semibold transition ${
          loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Mengupdate..." : "Update Role"}
      </button>

      {message.text && (
        <p
          className={`mt-5 text-center font-semibold ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}