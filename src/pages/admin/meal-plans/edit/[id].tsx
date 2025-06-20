import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import routes from "@/lib/routes";
import AdminLayout from "@/pages/admin/layout";
import { toast } from "sonner";

type DayPlan = {
  day: string;
  summary: string;
  recipes: { [time: string]: string };
};

type MealPlan = {
  title: string;
  description: string;
  summary: string;
  private: boolean;
  dailyPlans: DayPlan[];
};

export default function EditMealPlanPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = router.query;

  const { data, isLoading } = useQuery({
    queryKey: ["meal-plan", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosInstance.get(routes.admin.mealPlan(String(id)));
      return res.data;
    },
  });

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
  
  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setSummary(data.summary);
      setIsPrivate(data.private);
      setDailyPlans(data.dailyPlans || []);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload: MealPlan) => {
      return axiosInstance.patch(routes.admin.mealPlan_update(String(id)), payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plan", id] });
      toast.success("Meal plan updated!");
      router.push("/admin/meal-plans");
    },
  });

  const handleDayChange = (index: number, field: "day" | "summary", value: string) => {
    const updated = [...dailyPlans];
    updated[index] = { ...updated[index], [field]: value };
    setDailyPlans(updated);
  };

  const handleRecipeChange = (index: number, time: string, recipeId: string) => {
    const updated = [...dailyPlans];
    updated[index].recipes[time] = recipeId;
    setDailyPlans(updated);
  };

  const handleAddDay = () => {
    setDailyPlans([...dailyPlans, { day: "", summary: "", recipes: {} }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      title,
      description,
      summary,
      private: isPrivate,
      dailyPlans,
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <AdminLayout>
      <div className="mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Edit Meal Plan</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Summary</label>
            <input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <label>Private</label>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">Daily Plans</h2>
            {dailyPlans.map((day, i) => (
              <div key={i} className="border p-4 rounded mb-4 space-y-2">
                <input
                  type="date"
                  value={day.day}
                  onChange={(e) => handleDayChange(i, "day", e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
                <input
                  placeholder="Day Summary"
                  value={day.summary}
                  onChange={(e) => handleDayChange(i, "summary", e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
                <div className="space-y-2">
                  {Object.entries(day.recipes).map(([time, recipeId], idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => {
                          const newTime = e.target.value;
                          const newRecipes = { ...day.recipes };
                          delete newRecipes[time];
                          newRecipes[newTime] = recipeId;
                          const updated = [...dailyPlans];
                          updated[i].recipes = newRecipes;
                          setDailyPlans(updated);
                        }}
                        className="border px-2 py-1"
                      />
                      <select
                        value={recipeId}
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
                    onClick={() =>
                      handleRecipeChange(i, "06:00:00", "")
                    }
                    className="text-blue-500 text-sm"
                  >
                    + Add Recipe Time
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDay}
              className="text-blue-600 hover:underline"
            >
              + Add Day
            </button>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Updating..." : "Update Meal Plan"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
