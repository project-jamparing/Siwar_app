import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function WargaPage() {
  const cookie = await cookies();
  const nik = cookie.get('nik')?.value;

  if (!nik) {
    redirect('/login');
  }

  const user = await prisma.user.findFirst({
    where: { nik },
    include: { warga: true },
  });

  if (!user || user.role_id !== 4) {
    redirect('/login');
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-700">
        Selamat datang, <span className="font-semibold">{user.warga?.nama ?? user.nik}</span>. Silakan akses informasi iuran dan pengumuman melalui menu di sebelah kiri.
      </p>
    </div>
  );
}
