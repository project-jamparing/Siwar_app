'use client';
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    const handleLogout = async () => {
        const req = await fetch('/api/logout', {
            method: 'POST',
        });

        if (req.ok) {
            router.replace('/login');
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 text-red-500 hover:text-red-600"
            >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
            </button>

            {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-[90%] max-w-md animate-fade-in text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Logout</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Apakah kamu yakin ingin keluar dari akun ini?
                </p>

                <div className="flex justify-center gap-4">
                    <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
                    >
                    Batal
                    </button>
                    <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                    >
                    Yakin
                    </button>
                </div>
                </div>
            </div>
            )}
        </>
    );
}