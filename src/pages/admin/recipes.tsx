import AdminLayout from "./layout";

export default function AdminRecipes() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">Manage Recipes</h1>
      <p className="mb-4 text-gray-600">Add, update, or remove recipes from the app.</p>

      <ul className="space-y-4">
        <li className="border p-4 rounded shadow-sm">
          <h2 className="font-medium">Grilled Chicken & Quinoa</h2>
          <p className="text-sm text-gray-500">High protein • 400 kcal</p>
        </li>
        <li className="border p-4 rounded shadow-sm">
          <h2 className="font-medium">Avocado Smoothie</h2>
          <p className="text-sm text-gray-500">Healthy fats • 250 kcal</p>
        </li>
      </ul>
    </AdminLayout>
  );
}
