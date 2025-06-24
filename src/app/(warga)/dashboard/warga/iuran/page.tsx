import TabelTagihanWarga from "@/components/Tables/TabelTagihanWarga";

export default function TagihanPage() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      {/* Tambahkan text-center di sini */}
      <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">Tagihan Warga</h1>
      <TabelTagihanWarga />
    </main>
  );
}