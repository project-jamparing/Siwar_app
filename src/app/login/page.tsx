'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

export default function LoginPage() {
  const [nik, setNik] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ nik, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    console.log(data);
  
    if (res.ok) {
      // simpan status login di localStorage
      localStorage.setItem('isLoggedIn', 'true'); 
      localStorage.setItem('nik', data.nik);
      localStorage.setItem('role', data.role);


    if (res.ok) {
      localStorage.setItem('isLoggedIn', 'true');

      router.push(data.redirect);
    } else {
      setError(data.error || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="relative bg-white/40 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-10 w-full max-w-md space-y-6 animate-fadeIn">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-indigo-700 drop-shadow-md">SIWAR</h1>
          <p className="text-sm text-gray-600 font-medium">Sistem Informasi Warga</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={20} />
            <input
              type="text"
              placeholder="NIK"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 text-gray-800 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              autoComplete="username"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/60 text-gray-800 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-700 transition"
              tabIndex={-1}
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
             {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center font-semibold animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
          >
            Masuk
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} SIWAR. Made with 💙
        </p>
      </div>
    </div>
  );
}