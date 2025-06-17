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
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-100 to-white flex items-center justify-center px-4 py-10">
      <div className="flex flex-col-reverse md:flex-row w-full max-w-5xl rounded-3xl overflow-hidden bg-white/30 backdrop-blur-2xl shadow-xl ring-1 ring-white/40 border border-white/10">
        
        {/* Left - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center animate-fadeInUp">
          <div className="mb-8 text-center md:text-left space-y-1">
            <h1 className="text-4xl font-extrabold text-sky-700 tracking-tight leading-tight drop-shadow-md">
              Selamat Datang 👋
            </h1>
            <p className="text-sm text-gray-600">Masukkan NIK dan Password Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 group-hover:scale-110 transition-transform" size={20} />
              <input
                type="text"
                placeholder="NIK"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 transition focus:shadow-md"
                autoComplete="username"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 group-hover:scale-110 transition-transform" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 transition focus:shadow-md"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-500 hover:text-sky-700 transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center font-semibold animate-pulse">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-500 text-white font-semibold shadow-md hover:shadow-lg hover:bg-sky-600 transition duration-300"
            >
              Masuk
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            &copy; {new Date().getFullYear()} <span className="font-medium text-gray-700">SIWAR</span>. All rights reserved.
          </p>
        </div>

        {/* Right - Logo */}
        <div className="w-full md:w-1/2 bg-sky-50 flex items-center justify-center p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-200/50 to-sky-100/60 rounded-br-3xl blur-3xl opacity-60"></div>
          <div className="relative z-10 w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl ring-4 ring-sky-200 hover:scale-105 transition-transform duration-500">
            <img
              src="/images/logo/logo-dark.png"
              alt="Logo"
              className="w-28 h-28 object-contain"
            />
            <div className="absolute -inset-1 rounded-full bg-sky-400/10 blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}