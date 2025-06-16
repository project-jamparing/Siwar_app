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
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-5">
        {message && (
          <div
            className={`text-sm px-4 py-3 rounded-lg font-medium transition-all ${
              success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <PasswordInput
          label="Password Lama"
          value={passwordLama}
          onChange={setPasswordLama}
          show={showPasswordLama}
          toggleShow={() => setShowPasswordLama(!showPasswordLama)}
        />

        <PasswordInput
          label="Password Baru"
          value={passwordBaru}
          onChange={setPasswordBaru}
          show={showPasswordBaru}
          toggleShow={() => setShowPasswordBaru(!showPasswordBaru)}
        />

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
          className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition-all font-semibold disabled:opacity-60"
        >
          {loading ? 'Mengubah...' : 'Ganti Password'}
        </button>
      </form>
    </div>
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
        tabIndex={-1}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
