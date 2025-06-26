import FormIuranRT from '@/components/Forms/FormIuranRT';
import TabelIuranRT from '@/components/Tables/TabelIuranRT';


export default function PageRW() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard RW - Kelola Iuran Bulanan</h1>
      <FormIuranRT />
      <TabelIuranRT />
    </main>
  );
}
