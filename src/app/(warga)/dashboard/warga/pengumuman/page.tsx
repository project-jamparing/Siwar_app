import { cookies } from 'next/headers';
import PengumumanViewOnly from '@/components/PengumumanViewOnly';
import type { pengumuman as Pengumuman } from '@prisma/client';

export const dynamic = 'force-dynamic';

async function getData(page: number, limit: number, nik?: string) {
  let query = `?role=warga&terbaru=true&page=${page}&limit=${limit}`;
  if (nik) query += `&nik=${nik}`;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pengumuman${query}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return { data: [], total: 0, error: true };
  }

  const result = await res.json();
  return {
    data: result.data as Pengumuman[],
    total: result.total,
    error: false,
  };
}

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  const cookieStore = cookies();
  const nik = cookieStore.get('nik')?.value;

  const page = Number(searchParams.page || '1');
  const limit = 6;

  const { data, total, error } = await getData(page, limit, nik);

  if (error) {
    return <div className="p-4 text-red-500">Gagal fetch data pengumuman.</div>;
  }

  return (
    <PengumumanViewOnly
      data={data}
      role="warga"
      total={total}
      perPage={limit}
    />
  );
}
