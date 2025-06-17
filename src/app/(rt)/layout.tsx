import SidebarServer from '@/components/SidebarServer';

export default function RTLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-white">
        <SidebarServer />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
