import { cookies } from 'next/headers';
import PengumumanComponent from '@/components/Pengumuman/Pengumuman';
import type { pengumuman as Pengumuman } from '@prisma/client';

export const dynamic = 'force-dynamic';

async function getData(role: 'rw' | 'rt' | 'warga') {
  const cookieStore = await cookies();
  const nik = cookieStore.get('nik')?.value;

  const page = 1; // default halaman pertama
  const limit = 5; // batas pengumuman per halaman

  let query = `?role=${role}&terbaru=true&page=${page}&limit=${limit}`;

  if (role === 'rt' || role === 'warga') {
    query += `&nik=${nik}`;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pengumuman${query}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    return { data: [], error: true };
  }

  const result = await res.json();
  return { data: result.data as Pengumuman[], total: result.total, error: false };
}

export default async function Page() {
  const role = 'rw';
  const { data, total, error } = await getData(role);

  if (error) {
    return <div className="p-4 text-red-500">Gagal fetch data pengumuman.</div>;
  }

  return <PengumumanComponent data={data} role={role} total={total} perPage={5} />;
}
