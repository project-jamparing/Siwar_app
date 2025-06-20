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
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-100 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col-reverse md:flex-row w-full max-w-6xl rounded-3xl overflow-hidden bg-white/30 backdrop-blur-3xl shadow-2xl ring-1 ring-white/40 border border-white/10 transition-all animate-fadeInUp">

        {/* Left - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center space-y-8">
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-5xl font-extrabold text-sky-700 tracking-tight drop-shadow-sm">
              Selamat Datang
            </h1>
            <p className="text-base text-gray-600">Masukkan NIK dan Password Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            {/* NIK Input */}
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 group-hover:scale-110 transition-transform duration-200" size={20} />
              <input
                type="text"
                placeholder="NIK"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="peer w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-transparent border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:shadow-lg transition duration-200"
                autoComplete="username"
                required
                minLength={1}
              />
              <label className={`
                absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 text-sm 
                transition-all 
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                peer-focus:top-2 peer-focus:text-xs peer-focus:text-sky-500 
                peer-valid:top-2 peer-valid:text-xs peer-valid:text-sky-500
              `}>
                NIK
              </label>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 group-hover:scale-110 transition-transform duration-200" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full pl-10 pr-12 py-3 rounded-xl bg-white/80 text-gray-800 placeholder-transparent border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:shadow-lg transition duration-200"
                autoComplete="current-password"
                required
                minLength={1}
              />
              <label className={`
                absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 text-sm 
                transition-all 
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                peer-focus:top-2 peer-focus:text-xs peer-focus:text-sky-500 
                peer-valid:top-2 peer-valid:text-xs peer-valid:text-sky-500
              `}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-500 hover:text-sky-700 transition duration-150"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 text-center py-2 px-4 rounded-lg animate-pulse font-semibold text-sm shadow-inner">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition duration-300 ease-in-out"
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