import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

// Cron jalan tiap 30 detik
cron.schedule('*/30 * * * * *', async () => {
  console.log('⏰ [CRON] Running iuran every 30 sec');

  const todayStr = dayjs().format('YYYY-MM-DD');
  console.log(`Today: ${todayStr}`);

  const iurans = await prisma.iuran.findMany({
    where: {
      status: 'aktif',
    },
  });

  const kkList = await prisma.kk.findMany();

  for (const iuran of iurans) {
    const nagihStr = dayjs(iuran.tanggal_nagih).format('YYYY-MM-DD');

    if (nagihStr === todayStr) {
      console.log(`➡️  Memproses iuran ID ${iuran.id} - ${iuran.nama}`);

      for (const kk of kkList) {
        // Cek apakah tagihan sudah ada supaya ga double insert
        const existing = await prisma.tagihan.findFirst({
          where: {
            no_kk: kk.no_kk,
            iuran_id: iuran.id,
            status: 'belum_lunas',
          },
        });

        if (!existing) {
          await prisma.tagihan.create({
            data: {
              no_kk: kk.no_kk,
              iuran_id: iuran.id,
              status: 'belum_lunas',
            },
          });

          console.log(`✅ Tagihan baru untuk KK: ${kk.no_kk}`);
        }
      }
    } else {
      console.log(`⏭️  Lewat iuran ID ${iuran.id} (tanggal_nagih ${nagihStr})`);
    }
  }

  console.log('🏁 [CRON] Selesai');
});
