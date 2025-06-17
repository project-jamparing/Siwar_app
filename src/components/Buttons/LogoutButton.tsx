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
        router.replace('/login');
      } else {
        alert('Gagal logout. Coba lagi.');
        setLoading(false);
      }
    } catch (err) {
      alert('Terjadi kesalahan.');
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-red-400 rounded-md px-2 py-1"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 md:p-8 rounded-2xl shadow-2xl w-[90%] max-w-md animate-fade-in-up">
            <h2 className="text-xl font-bold mb-2">Konfirmasi Logout</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Apakah kamu yakin ingin keluar dari akun ini?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
