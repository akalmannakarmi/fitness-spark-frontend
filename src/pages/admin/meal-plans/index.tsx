import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "../layout";
import axiosInstance from "@/lib/axios";
import routes from "@/lib/routes";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

type MealPlan = {
  _id: string;
  user: string;
  title: string;
  private: boolean;
};

export default function AdminMealPlans() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-meal_plans"],
    queryFn: async () => {
      const res = await axiosInstance.get(routes.admin.mealPlans);
      return res.data.meal_plans as MealPlan[];
    },
  });

  const handleEdit = (id: string) => {
    router.push(`/admin/meal-plans/edit/${id}`);
  };

  const useDeleteMealPlan = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (id: string) => {
        await axiosInstance.delete(routes.admin.mealPlan_delete(id));
      },
      onSuccess: () => {
        toast.success("Meal Plan deleted successfully!");
        queryClient.invalidateQueries({queryKey:["admin-meal_plans"]});
      },
      onError: () => {
        toast.error("Failed to delete meal_plans.");
      },
    });
  };
  const deleteMutation = useDeleteMealPlan();

  const handleDelete = (id: string) => {
    console.log("Delete recipe", id);

    if (confirm("Are you sure you want to delete this recipe?")) {
        deleteMutation.mutate(id);
    }
  };
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Meal Plans</h1>
          <p className="text-gray-600">Create, edit or delete meal plans.</p>
        </div>
        <button
          onClick={() => router.push("/admin/meal-plans/create")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Meal Plan
        </button>
      </div>

      {isLoading && <p>Loading meal plans...</p>}
      {error && <p className="text-red-500">Failed to load meal plans.</p>}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600">
                <th className="p-3 border-b">Title</th>
                <th className="p-3 border-b">User</th>
                <th className="p-3 border-b">Privacy</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((plan) => (
                <tr key={plan._id} className="border-t hover:bg-gray-50 text-sm">
                  <td className="p-3">{plan.title}</td>
                  <td className="p-3">{plan.user}</td>
                  <td className="p-3">
                    {plan.private ? "Private 🔒" : "Public 🌐"}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(plan._id)}
                        className="flex items-center px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(plan._id)}
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
      )}
    </AdminLayout>
  );
}
