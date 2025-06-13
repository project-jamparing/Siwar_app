import PengumumanViewOnly from '@/components/PengumumanViewOnly';
import { cookies } from 'next/headers';
import { Pengumuman } from '@/lib/type/pengumuman';

export default async function PengumumanPage() {
  const cookieStore = cookies();
  const nik = cookieStore.get('nik')?.value?.trim() || '';
  const role = 'warga';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    throw new Error('ENV NEXT_PUBLIC_BASE_URL tidak ditemukan');
  }

  const url = `${baseUrl}/api/pengumuman?role=${encodeURIComponent(role)}&nik=${encodeURIComponent(nik)}`;
  console.log("FETCH URL:", url);

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Gagal fetch pengumuman: ${res.status}`);
  }

  const data: Pengumuman[] = await res.json();

  return <PengumumanViewOnly data={data} />;
}
