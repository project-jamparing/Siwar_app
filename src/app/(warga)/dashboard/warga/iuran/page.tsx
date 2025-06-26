// Path: src/app/(warga)/dashboard/warga/iuran/page.tsx
// Halaman ini akan memuat komponen TabelTagihanWarga
// Judul "Tagihan Warga" dan styling halaman sudah diatur di dalam TabelTagihanWarga
import TabelTagihanWarga from "@/components/Tables/TabelTagihanWarga";

export default function TagihanPage() {
  return (
    // Menggunakan p-6 dan background yang konsisten dengan desain lainnya
    <main className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-sans">
      {/* Menghapus elemen h1 di sini karena judul "Tagihan Warga" sudah 
        ada di dalam komponen TabelTagihanWarga untuk menghindari duplikasi.
      */}
      {/* <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">Tagihan Warga</h1> */}
      
      {/* Komponen TabelTagihanWarga yang sudah memiliki styling dan judulnya sendiri */}
      {/* Tidak perlu div wrapper terpisah dengan styling seperti bg-white shadow rounded p-4 border border-gray-200 */}
      {/* karena TabelTagihanWarga sudah memiliki container stylenya sendiri. */}
      <TabelTagihanWarga />
    </main>
  );
}
