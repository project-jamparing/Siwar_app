// src/app/api/iuran/nonaktifkan/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const iuranId = Number(params.id)

  if (isNaN(iuranId)) {
    return NextResponse.json(
      { success: false, message: 'ID iuran tidak valid' },
      { status: 400 }
    )
  }

  try {
    const updated = await prisma.iuran.update({
      where: { id: iuranId },
      data: { status: 'nonaktif' },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Gagal menonaktifkan iuran', error },
      { status: 500 }
    )
  }
}
