import { Suspense } from 'react';
import EditWargaForm from '@/components/EditWargaForm';

export default function EditPage({ params }: { params: { nik: string } }) {
  return (
    <Suspense fallback={<p>Loading form...</p>}>
      <EditWargaForm nik={params.nik} />
    </Suspense>
  );
}