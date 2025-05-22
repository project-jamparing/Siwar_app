'use client';
import { useEffect, useState } from 'react';
import Pengumuman from '@/components/Pengumuman';
import Link from 'next/link';

export default function PengumumanRT() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pengumuman')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data.length) return (
    <>
      <Link
        href="/dashboard/rt/pengumuman/tambah"
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        + Tambah Pengumuman
      </Link>
      <p>Belum ada pengumuman.</p>
    </>
  );

  return (
    <div>
      <Link
        href="/dashboard/rt/pengumuman/tambah"
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        + Tambah Pengumuman
      </Link>
      <Pengumuman data={data} />
    </div>
  );
}
