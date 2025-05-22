import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "siwar_db", 
};

export async function POST(req: NextRequest) {
  console.log("API /api/iuran dipanggil");

  try {
    const body = await req.json();

    const { nama, nominal, tanggal_tagih, tanggal_bayar, tanggal_tempo } = body;

    if (!nama || !nominal || !tanggal_tagih || !tanggal_bayar || !tanggal_tempo) {
      return NextResponse.json(
        { status: "error", message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const conn = await mysql.createConnection(dbConfig);

    const query = `
      INSERT INTO iuran (nama, nominal, tanggal_tagih, tanggal_bayar, tanggal_tempo)
      VALUES (?, ?, ?, ?, ?)
    `;

    await conn.execute(query, [
      nama,
      nominal,
      tanggal_tagih,
      tanggal_bayar,
      tanggal_tempo,
    ]);

    await conn.end();

    return NextResponse.json({ status: "success", message: "Data berhasil disimpan" });
  } catch (err) {
    console.error("Error simpan data iuran:", err);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
