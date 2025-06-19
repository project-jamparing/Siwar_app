'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
      });

      if (res.ok) {
        localStorage.removeItem('isLoggedIn');
        router.replace('/login');
      } else {
        alert('Gagal logout. Coba lagi.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan.');
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-red-400 rounded-md px-2 py-1 active:scale-95"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all animate-fade-in">
          <div className="bg-white text-gray-800 p-6 md:p-8 rounded-3xl shadow-2xl w-[90%] max-w-md transform scale-95 animate-scale-in">
            <h2 className="text-2xl font-extrabold mb-4 text-center text-gray-900">
              Konfirmasi Logout
            </h2>
            <p className="text-sm text-gray-600 mb-8 text-center">
              Apakah kamu yakin ingin keluar dari akun ini?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-lg text-gray-700 border border-gray-300 bg-white hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-95 font-medium shadow-sm"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 font-semibold shadow-md"
              >
                {loading ? 'Keluar...' : 'Yakin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}