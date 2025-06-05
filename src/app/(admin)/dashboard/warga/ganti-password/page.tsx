import FormGantiPassword from "@/components/Forms/FormGantiPassword";

export default function GantiPasswordPage() {
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md text-gray-900">
      <h2 className="text-2xl font-semibold mb-4">Ganti Password</h2>
      <FormGantiPassword />
    </div>
  );
}