// src/app/(dashboard)/dashboard/rw/page.tsx (atau file layout tsx lainnya)

import StatusIuranTable from '@/components/Tables/StatusIuranTable'

export default function DashboardRW() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard RW</h1>
      <StatusIuranTable />
    </div>
  )
}
