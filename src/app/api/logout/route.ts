import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const cookie = await cookies();
        cookie.delete('token');
        cookie.delete('nik');
        cookie.delete('role_id');
        console.log(req)
        
        return NextResponse.json({ message: 'Logout berhasil' });
    } catch (error) {
        return NextResponse.error();
        console.log(error);
    }
}