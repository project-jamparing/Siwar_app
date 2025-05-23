'use client';

import { useEffect, useState } from 'react';
import Pengumuman from '@/components/Pengumuman';

export default function RTPage() {
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
  if (!data.length) return <p>Belum ada pengumuman.</p>;

  return <Pengumuman data={data} />;
}
