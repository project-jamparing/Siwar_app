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
      router.push(data.redirect);
    } else {
      setError(data.error || 'Login gagal');
    }
  };  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-300 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-md space-y-6 border border-gray-300"
        autoComplete="off"
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">Login SIWAR</h2>

        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="NIK"
            value={nik}
            onChange={(e) => setNik(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black transition"
            autoComplete="username"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black transition"
            autoComplete="current-password"
            required
          />
          <button
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 focus:outline-none"
            tabIndex={-1} 
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="text-red-600 text-center text-sm font-medium">{error}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold text-lg"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}