import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tagihanId = Number(params.id)

    if (isNaN(tagihanId)) {
      return NextResponse.json(
        { success: false, message: 'ID tagihan tidak valid.' },
        { status: 400 }
      )
    }

    const updated = await prisma.tagihan.update({
      where: { id: tagihanId },
      data: { status: 'lunas' }, // ✅ enum valid
    })

    return NextResponse.json({
      success: true,
      message: 'Tagihan sudah dikonfirmasi lunas',
      data: updated,
    })
  } catch (error) {
    console.error('❌ PATCH /api/tagihan/[id]/bayar error:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengubah status tagihan.' },
      { status: 500 }
    )
  }
}
