import AdminLayout from "./layout";

export default function SiteContentEditor() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">Edit Site Content</h1>
      <p className="mb-4 text-gray-600">Update text shown on the home page and other public pages.</p>

      <form className="space-y-6 max-w-2xl">
        <div>
          <label className="block font-medium mb-1">Homepage Headline</label>
          <input
            type="text"
            defaultValue="Fuel Your Fitness with Smart Meal Planning"
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Homepage Description</label>
          <textarea
            rows={4}
            className="w-full border px-4 py-2 rounded"
            defaultValue="Fitness Spark helps you build meal plans, track recipes, and stay on top of your fitness goals."
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </AdminLayout>
  );
}
