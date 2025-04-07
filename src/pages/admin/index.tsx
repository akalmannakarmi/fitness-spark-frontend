import AdminLayout from "./layout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-700 mb-6">Here’s what’s happening at a glance:</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl font-bold mt-2">1,024</p>
        </div>
        <div className="bg-green-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Meal Plans</h2>
          <p className="text-2xl font-bold mt-2">58</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Recipes</h2>
          <p className="text-2xl font-bold mt-2">136</p>
        </div>
      </div>
    </AdminLayout>
  );
}
