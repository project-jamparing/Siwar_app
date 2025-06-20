import PengumumanViewOnly from '@/components/PengumumanViewOnly';
import prisma from '@/lib/prisma';

export default async function PengumumanPage() {
  const perPage = 6;

  // Ambil semua pengumuman termasuk relasi RT
  const pengumuman = await prisma.pengumuman.findMany({
    include: {
      rukun_tetangga: true,
    },
    orderBy: {
      tanggal: 'desc',
    },
    take: perPage,
    skip: 0,
  });

  const total = await prisma.pengumuman.count();

  return (
    <PengumumanViewOnly
      data={pengumuman}
      total={total}
      perPage={perPage}
      role="admin"
    />
  );
}
