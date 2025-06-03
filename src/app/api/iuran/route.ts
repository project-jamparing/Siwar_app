import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "siwar_db",
};

export async function GET() {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM iuran ORDER BY id DESC');
    await conn.end();

    const formatted = (rows as any[]).map((row) => ({
      id: row.id,
      nama: row.nama,
      nominal: row.nominal,
      tanggalNagih: row.tanggal_nagih,
      tanggalTempo: row.tanggal_tempo,
      deskripsi: row.deskripsi,
      kategori_id: row.kategori_id,
      status: row.status,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan', error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nama,
      nominal,
      tanggalNagih,
      tanggalTempo,
      deskripsi,
      kategori_id,
      status,
    } = body;

    if (
      !nama?.trim() ||
      isNaN(nominal) ||
      !tanggalNagih ||
      !tanggalTempo ||
      !deskripsi?.trim() ||
      isNaN(kategori_id) ||
      !status?.trim()
    ) {
      return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
    }

    const conn = await mysql.createConnection(dbConfig);
    await conn.execute(
      `INSERT INTO iuran (nama, nominal, tanggal_nagih, tanggal_tempo, deskripsi, kategori_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nama, nominal, tanggalNagih, tanggalTempo, deskripsi, kategori_id, status]
    );
    await conn.end();

    return NextResponse.json({ message: 'Data berhasil disimpan' });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan', error }, { status: 500 });
  }
}
