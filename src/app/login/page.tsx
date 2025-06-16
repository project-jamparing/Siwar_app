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

    if (res.ok) {
      localStorage.setItem('isLoggedIn', 'true');
      router.push(data.redirect);
    } else {
      setError(data.error || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-sky-200 to-white flex items-center justify-center px-4 py-10">
      <div className="flex flex-col-reverse md:flex-row w-full max-w-6xl rounded-3xl overflow-hidden bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] ring-1 ring-white/30">
        
        {/* Left - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center animate-fadeInUp">
          <div className="mb-8 text-center md:text-left space-y-2">
            <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight leading-tight">
              Selamat Datang
            </h1>
            <p className="text-sm text-gray-600">Masukkan NIK dan Password Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={20} />
              <input
                type="text"
                placeholder="NIK"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
                className="w-full pl-10 pr-12 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center font-medium animate-pulse">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-xl"
            >
              Masuk
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            &copy; {new Date().getFullYear()} SIWAR. All rights reserved.
          </p>
        </div>

        {/* Right - Logo */}
        <div className="w-full md:w-1/2 bg-indigo-100 flex items-center justify-center p-10">
          <div className="relative w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-xl ring-4 ring-indigo-300/40 hover:scale-105 transition-transform duration-500">
            <img
              src="/images/logo/logo-dark.png"
              alt="Logo"
              className="w-28 h-28 object-contain"
            />
            <div className="absolute -inset-1 rounded-full bg-indigo-400/10 blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
