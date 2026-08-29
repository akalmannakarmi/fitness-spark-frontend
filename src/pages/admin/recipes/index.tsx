import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/pages/admin/layout";
import axiosInstance from "@/lib/axios";
import routes from "@/lib/routes";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useState } from "react";
import type { Recipe, RecipeList } from "@/types/api";

export default function AdminRecipes() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pendingDelete, setPendingDelete] = useState<Recipe | null>(null);

  const { data, isLoading, error } = useQuery<RecipeList>({
    queryKey: ["admin-recipes", debouncedSearch, page, limit],
    queryFn: async () => {
      const res = await axiosInstance.get(routes.admin.recipes, {
        params: { search: debouncedSearch, page, limit },
      });
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(routes.admin.recipeDelete(id));
    },
    onSuccess: () => {
      toast.success("Recipe deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-recipes"] });
    },
    onError: () => {
      toast.error("Failed to delete recipe.");
    },
  });

  const handleEdit = (id: string) => {
    router.replace(`/admin/recipes/edit/${id}`);
  };

  const handleConfirmDelete = () => {
    if (pendingDelete) deleteMutation.mutate(pendingDelete._id);
    setPendingDelete(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Recipes</h1>
          <p className="text-gray-600">
            Add, update, or remove recipes from the app.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/recipes/create")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Recipe
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search recipes..."
          className="px-4 py-2 border rounded w-full md:w-1/3"
        />
      </div>

      {isLoading && <p>Loading recipes...</p>}
      {error && <p className="text-red-500">Error loading recipes.</p>}

      {!isLoading && !error && data && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-600">
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Ready in (min)</th>
                  <th className="p-3 border-b">Servings</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.recipes.map((recipe) => (
                  <tr
                    key={recipe._id}
                    className="border-t hover:bg-gray-50 text-sm"
                  >
                    <td className="p-3">{recipe.title}</td>
                    <td className="p-3">{recipe.readyInMinutes}</td>
                    <td className="p-3">{recipe.servings}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(recipe._id)}
                          className="flex items-center px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => setPendingDelete(recipe)}
                          className="flex items-center px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2 py-1">
              Page {data.page} of {data.pages}
            </span>
            <button
              disabled={page === data.pages}
              onClick={() => setPage((prev) => Math.min(data.pages, prev + 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete recipe"
        message={`Are you sure you want to delete "${pendingDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  );
}
