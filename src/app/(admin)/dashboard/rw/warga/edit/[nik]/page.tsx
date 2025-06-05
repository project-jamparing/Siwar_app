import { Suspense } from 'react';
import EditWargaForm from '@/components/Forms/EditWargaForm';

export default async function EditPage({ params }: { params: { nik: string } }) {
  const nik = params.nik;

  return (
    <Suspense fallback={<p>Loading form...</p>}>
      <EditWargaForm nik={nik} />
    </Suspense>
  );
}
