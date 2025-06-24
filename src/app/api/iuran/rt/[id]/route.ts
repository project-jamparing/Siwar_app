// Path: C:\Users\LENOVO\Siwar_app\src\app\api\iuran\rt\[id]\route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// import { getRTFromSession } from '@/lib/auth' // uncomment this line when you have authentication

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const iuranId = parseInt(params.id);

  // --- START PERUBAHAN PENTING ---
  // Mengambil rt_id dari cookie, bukan di-hardcode
  const rtIdFromCookie = req.cookies.get('rt_id')?.value;

  if (!rtIdFromCookie) {
    console.error('❌ RT ID tidak ditemukan di cookie.');
    return NextResponse.json(
      { success: false, message: 'RT ID tidak ditemukan di cookie. Pastikan Anda sudah login.' },
      { status: 401 } // Unauthorized
    );
  }

  const rtId = parseInt(rtIdFromCookie);

  if (isNaN(rtId)) {
    console.error('❌ RT ID dari cookie tidak valid (bukan format angka).');
    return NextResponse.json(
      { success: false, message: 'RT ID dari cookie tidak valid (bukan format angka).' },
      { status: 400 } // Bad Request
    );
  }
  // --- END PERUBAHAN PENTING ---

  // Validate the iuranId from the URL parameter
  if (isNaN(iuranId)) {
    console.error('❌ Invalid iuran ID provided:', params.id);
    return NextResponse.json({ error: 'Invalid Iuran ID' }, { status: 400 });
  }

  try {
    console.log(`▶️ Fetching detail tagihan for iuran ID: ${iuranId} and RT ID: ${rtId}`);

    // Query Prisma to get tagihan related to the specific iuranId and rtId
    const tagihan = await prisma.tagihan.findMany({
      where: {
        iuran_id: iuranId,
        NOT: {
          no_kk: null, // Ensure only tagihan with a non-null KK are included
        },
        kk: {
          rt_id: rtId, // Filter by RT ID (sekarang sudah dinamis dari cookie)
        },
      },
      select: {
        id: true,
        status: true,
        tanggal_bayar: true,
        kk: {
          select: {
            no_kk: true,
            // Select the 'nama' from the related 'warga' through 'warga_kk_nikTowarga'
            warga_kk_nikTowarga: {
              select: {
                nama: true,
              },
            },
          },
        },
      },
      orderBy: { // Menambahkan orderBy agar hasilnya konsisten, opsional tapi direkomendasikan
        tanggal_bayar: 'desc',
      }
    });

    console.log('✅ Raw data from Prisma (tagihan.findMany):', JSON.stringify(tagihan, null, 2));

    // Map the Prisma result to the desired frontend structure
    // This transforms `warga_kk_nikTowarga.nama` into `nama_kepala_keluarga`
    const hasil = tagihan.map((t) => ({
      id: t.id,
      status: t.status,
      tanggal_bayar: t.tanggal_bayar ? t.tanggal_bayar.toISOString().split('T')[0] : null, // Format tanggal
      kk: {
        no_kk: t.kk?.no_kk ?? '-',
        // Access nama from the nested relation and provide a fallback
        nama_kepala_keluarga: t.kk?.warga_kk_nikTowarga?.nama ?? '-',
      },
    }));

    console.log('✅ Processed data sent to client:', JSON.stringify(hasil, null, 2));

    return NextResponse.json(hasil); // Return the processed data
  } catch (error: any) {
    console.error('❌ Error fetching detail tagihan RT:', error);
    return NextResponse.json(
      { message: 'Failed to fetch detail payment data.', error: error.message },
      { status: 500 } // Internal Server Error
    );
  }
}