'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function FormGantiPassword() {
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showPasswordLama, setShowPasswordLama] = useState(false);
  const [showPasswordBaru, setShowPasswordBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSuccess(false);

    if (passwordBaru !== konfirmasi) {
      setMessage('Konfirmasi password tidak cocok');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user/ganti-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password_lama: passwordLama,
          password_baru: passwordBaru,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan');

      setMessage('Password berhasil diubah!');
      setSuccess(true);
      setPasswordLama('');
      setPasswordBaru('');
      setKonfirmasi('');
    } catch (err: any) {
      setMessage(err.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`mb-4 text-sm px-4 py-2 rounded ${
            success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      {/* Password Lama */}
      <PasswordInput
        label="Password Lama"
        value={passwordLama}
        onChange={setPasswordLama}
        show={showPasswordLama}
        toggleShow={() => setShowPasswordLama(!showPasswordLama)}
      />

      {/* Password Baru */}
      <PasswordInput
        label="Password Baru"
        value={passwordBaru}
        onChange={setPasswordBaru}
        show={showPasswordBaru}
        toggleShow={() => setShowPasswordBaru(!showPasswordBaru)}
      />

      {/* Konfirmasi */}
      <PasswordInput
        label="Konfirmasi Password Baru"
        value={konfirmasi}
        onChange={setKonfirmasi}
        show={showKonfirmasi}
        toggleShow={() => setShowKonfirmasi(!showKonfirmasi)}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
      >
        {loading ? 'Mengubah...' : 'Ganti Password'}
      </button>
    </form>
  );
}

type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  show: boolean;
  toggleShow: () => void;
};

function PasswordInput({
  label,
  value,
  onChange,
  show,
  toggleShow,
}: PasswordInputProps) {
  return (
    <div className="relative">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
        tabIndex={-1}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}