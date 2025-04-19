import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import AdminLayout from "@/pages/admin/layout";
import axiosInstance from "@/lib/axios";
import routes from "@/lib/routes";
import { toast } from "sonner";

type RecipeUpdatePayload = {
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  cheep: boolean;
  ingredients: { name: string; amount: number; unit: string }[];
  nutrients: { name: string; amount: number; unit: string }[];
  steps: string[];
};

export default function EditRecipePage() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["recipe", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosInstance.get(routes.admin.recipe(String(id)));
      return res.data;
    },
  });

  const [title, setTitle] = useState("");
  const [readyInMinutes, setReadyInMinutes] = useState(0);
  const [servings, setServings] = useState(0);
  const [steps, setSteps] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<{ name: string; amount: number; unit: string }[]>([]);
  const [image, setImage] = useState("");
  const [vegetarian, setVegetarian] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [dairyFree, setDairyFree] = useState(false);
  const [cheep, setCheep] = useState(false);
  const [nutrients, setNutrients] = useState<{ name: string; amount: number; unit: string }[]>([]);

  useEffect(() => {
    if (data) {
      console.log(data); // Log to inspect the structure of the data
      setTitle(data.title || "");
      setReadyInMinutes(data.readyInMinutes || 0);
      setServings(data.servings || 0);
      setSteps(data.steps || []);
      setIngredients(data.ingredients || []);
      setImage(data.image || "");
      setVegetarian(data.vegetarian);
      setVegan(data.vegan);
      setGlutenFree(data.glutenFree);
      setDairyFree(data.dairyFree);
      setCheep(data.cheep);
      setNutrients(data.nutrients || []); // Make sure nutrients is set correctly
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (formData: RecipeUpdatePayload) => {
      return axiosInstance.patch(routes.admin.recipe_update(String(id)), formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", String(id)] });
      toast.success("Recipe updated!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      title,
      image,
      readyInMinutes,
      servings,
      vegetarian,
      vegan,
      glutenFree,
      dairyFree,
      cheep,
      ingredients,
      nutrients,
      steps,
    });
  };

  const handleIngredientChange = (index: number, field: string, value: string | number) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const handleStepChange = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const handleAddNutrient = () => {
    setNutrients([...nutrients, { name: "", amount: 0, unit: "" }]);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <AdminLayout>
      <div className="mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>
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
            <label className="block font-medium">Image URL</label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <label>Ready in Minutes</label>
              <input
                type="number"
                value={readyInMinutes}
                onChange={(e) => setReadyInMinutes(Number(e.target.value))}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label>Servings</label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[["Vegetarian", vegetarian, setVegetarian], ["Vegan", vegan, setVegan], ["Gluten Free", glutenFree, setGlutenFree], ["Dairy Free", dairyFree, setDairyFree], ["Cheap", cheep, setCheep]].map(
              ([label, value, setter]) => (
                <label key={label as string} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value as boolean}
                    onChange={(e) => (setter as Function)(e.target.checked)}
                  />
                  {label as string}
                </label>
              )
            )}
          </div>

          {/* Ingredients */}
          <div>
            <label className="block font-medium">Ingredients</label>
            {ingredients.map((ingredient, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  placeholder="Name"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
                  className="border px-2 py-1 w-1/3"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={ingredient.amount}
                  onChange={(e) => handleIngredientChange(idx, "amount", parseFloat(e.target.value))}
                  className="border px-2 py-1 w-1/3"
                />
                <input
                  placeholder="Unit"
                  value={ingredient.unit}
                  onChange={(e) => handleIngredientChange(idx, "unit", e.target.value)}
                  className="border px-2 py-1 w-1/3"
                />
                <button type="button" onClick={() => setIngredients((prev) => prev.filter((_, i) => i !== idx))}>
                  ❌
                </button>
              </div>
            ))}
            <button type="button" className="text-blue-500 mt-1" onClick={() => setIngredients([...ingredients, { name: "", amount: 0, unit: "" }])}>
              + Add Ingredient
            </button>
          </div>

          {/* Nutrients */}
          <div>
            <h2 className="font-medium mb-1">Nutrients</h2>
            {nutrients.map((nutrient, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  className="border p-2 rounded"
                  placeholder="Nutrient Name"
                  value={nutrient.name}
                  onChange={(e) => {
                    const updated = [...nutrients];
                    updated[i].name = e.target.value;
                    setNutrients(updated);
                  }}
                />
                <input
                  type="number"
                  className="border p-2 rounded"
                  placeholder="Amount"
                  value={nutrient.amount}
                  onChange={(e) => {
                    const updated = [...nutrients];
                    updated[i].amount = parseFloat(e.target.value);
                    setNutrients(updated);
                  }}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Unit"
                  value={nutrient.unit}
                  onChange={(e) => {
                    const updated = [...nutrients];
                    updated[i].unit = e.target.value;
                    setNutrients(updated);
                  }}
                />
              </div>
            ))}
            <button type="button" onClick={handleAddNutrient} className="text-blue-600 hover:underline">
              + Add Nutrient
            </button>
          </div>

          {/* Steps */}
          <div>
            <label className="block font-medium">Steps</label>
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <textarea
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
                <button type="button" onClick={() => setSteps((prev) => prev.filter((_, i) => i !== idx))}>
                  ❌
                </button>
              </div>
            ))}
            <button type="button" className="text-blue-500 mt-1" onClick={() => setSteps([...steps, ""])}>
              + Add Step
            </button>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Recipe"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
