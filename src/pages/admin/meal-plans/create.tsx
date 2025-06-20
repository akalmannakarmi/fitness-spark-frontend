import { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import routes from "@/lib/routes";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type RecipeTimeMap = { [time: string]: string };

type DayPlan = {
  day: string;
  summary: string;
  recipes: RecipeTimeMap;
};

export default function CreateMealPlanPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [dailyPlans, setDailyPlans] = useState<DayPlan[]>([]);
  const { data: recipeOptions } = useQuery({
    queryKey: ["all-recipes"],
    queryFn: async () => {
      const res = await axiosInstance.get(routes.recipes_list);
      return res.data.recipes;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: object) => {
      return axiosInstance.post(routes.admin.mealPlan_create, data);
    },
    onSuccess: () => {
      toast.success("Meal plan created!");
      queryClient.invalidateQueries({ queryKey: ["meal_plans"] });
      router.push("/admin/meal-plans");
    },
    onError: () => {
      toast.error("Failed to create meal plan.");
    },
  });

  const handleAddDay = () => {
    setDailyPlans([...dailyPlans, { day: "", summary: "", recipes: {} }]);
  };

  const handleDayChange = (
    index: number,
    field: "day" | "summary",
    value: string
  ) => {
    const updated = [...dailyPlans];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setDailyPlans(updated);
  };

  const handleRecipeChange = (dayIndex: number, time: string, recipeId: string) => {
    const updated = [...dailyPlans];
    updated[dayIndex].recipes[time] = recipeId;
    setDailyPlans(updated);
  };

  const handleAddRecipeTime = (dayIndex: number) => {
    const updated = [...dailyPlans];
    updated[dayIndex].recipes[""] = "";
    setDailyPlans(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      description,
      summary,
      private: isPrivate,
      dailyPlans,
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Create Meal Plan</h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block font-medium">Title</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Summary</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            Private
          </label>

          <div>
            <h2 className="font-semibold mb-2">Daily Plans</h2>
            {dailyPlans.map((day, i) => (
              <div key={i} className="p-4 mb-4 border rounded bg-gray-50 space-y-3">
                <div className="flex gap-4">
                  <input
                    type="date"
                    value={day.day}
                    onChange={(e) => handleDayChange(i, "day", e.target.value)}
                    className="border px-2 py-1 rounded w-1/2"
                  />
                  <input
                    placeholder="Day Summary"
                    value={day.summary}
                    onChange={(e) => handleDayChange(i, "summary", e.target.value)}
                    className="border px-2 py-1 rounded w-1/2"
                  />
                </div>

                <div className="space-y-2">
                  {Object.entries(day.recipes).map(([time, id], j) => (
                    <div key={j} className="flex gap-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => {
                          const updated = { ...day.recipes };
                          const val = updated[time];
                          delete updated[time];
                          updated[e.target.value] = val;
                          const newPlans = [...dailyPlans];
                          newPlans[i].recipes = updated;
                          setDailyPlans(newPlans);
                        }}
                        className="border px-2 py-1 rounded w-1/3"
                      />
                      <select
                        value={id}
                        onChange={(e) => handleRecipeChange(i, time, e.target.value)}
                        className="border px-2 py-1 rounded w-2/3"
                      >
                        <option value="">Select Recipe</option>
                        {recipeOptions?.map((recipe: { _id: string; title: string }) => (
                          <option key={recipe._id} value={recipe._id}>
                            {recipe.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddRecipeTime(i)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    + Add Time Slot
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setDailyPlans((prev) => prev.filter((_, d) => d !== i))}
                  className="text-red-500 text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Day
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddDay}
              className="text-blue-600 hover:underline"
            >
              <Plus className="inline-block w-4 h-4 mr-1" />
              Add Day Plan
            </button>
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {createMutation.isPending ? "Creating..." : "Create Meal Plan"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
