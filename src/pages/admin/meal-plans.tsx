import AdminLayout from "./layout";

export default function AdminMealPlans() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">Manage Meal Plans</h1>
      <p className="mb-4 text-gray-600">Create, edit or delete meal plans.</p>

      {/* TODO: Replace with real backend data */}
      <div className="space-y-4">
        <div className="p-4 border rounded shadow-sm bg-white">
          <h2 className="font-semibold">Lean Bulk Plan</h2>
          <p className="text-sm text-gray-500">12 meals • High protein</p>
        </div>
        <div className="p-4 border rounded shadow-sm bg-white">
          <h2 className="font-semibold">Fat Loss Plan</h2>
          <p className="text-sm text-gray-500">8 meals • Low carb</p>
        </div>
      </div>
    </AdminLayout>
  );
}
