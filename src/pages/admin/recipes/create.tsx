import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import routes from "@/lib/routes";
import { toast } from "sonner";
import AdminLayout from "../layout";

export default function CreateRecipePage() {
  const router = useRouter();

  // State for all the fields
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [readyInMinutes, setReadyInMinutes] = useState(0);
  const [servings, setServings] = useState(1);
  const [vegetarian, setVegetarian] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [dairyFree, setDairyFree] = useState(false);
  const [cheep, setCheep] = useState(false);

  const filters: [string, boolean, Dispatch<SetStateAction<boolean>>][] = [["Vegetarian", vegetarian, setVegetarian], ["Vegan", vegan, setVegan], ["Gluten Free", glutenFree, setGlutenFree], ["Dairy Free", dairyFree, setDairyFree], ["Cheap", cheep, setCheep]]

  const [ingredients, setIngredients] = useState([{ name: "", amount: 0, unit: "" }]);
  const [steps, setSteps] = useState([""]);
  const [nutrients, setNutrients] = useState([{ name: "", amount: 0, unit: "" }]);

  const createMutation = useMutation({
    mutationFn: async (data: object) => {
      return axiosInstance.post(routes.admin.recipe_create, data);
    },
    onSuccess: () => {
      toast.success("Recipe created!");
      router.push("/admin/recipes");
    },
    onError: () => {
      toast.error("Failed to create recipe");
    },
  });

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: 0, unit: "" }]);
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleAddNutrient = () => {
    setNutrients([...nutrients, { name: "", amount: 0, unit: "" }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
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
      steps,
      nutrients,
    });
  };

  return (
    <AdminLayout>
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Ready in Minutes"
          value={readyInMinutes}
          onChange={(e) => setReadyInMinutes(Number(e.target.value))}
        />
        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Servings"
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
        />

        <div className="grid grid-cols-2 gap-4">
            {filters.map(
                ([label, value, setter]) => (
                <label key={label as string} className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    checked={value as boolean}
                    onChange={(e) => setter(e.target.checked)}
                    />
                    {label as string}
                </label>
                )
            )}
            </div>

        <div>
          <h2 className="font-medium mb-1">Ingredients</h2>
          {ingredients.map((ingredient, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
              <input
                className="border p-2 rounded"
                placeholder="Name"
                value={ingredient.name}
                onChange={(e) => {
                  const updated = [...ingredients];
                  updated[i].name = e.target.value;
                  setIngredients(updated);
                }}
              />
              <input
                type="number"
                className="border p-2 rounded"
                placeholder="Amount"
                value={ingredient.amount}
                onChange={(e) => {
                  const updated = [...ingredients];
                  updated[i].amount = parseFloat(e.target.value);
                  setIngredients(updated);
                }}
              />
              <input
                className="border p-2 rounded"
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(e) => {
                  const updated = [...ingredients];
                  updated[i].unit = e.target.value;
                  setIngredients(updated);
                }}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddIngredient} className="text-blue-600 hover:underline">
            + Add Ingredient
          </button>
        </div>


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

        <div>
          <h2 className="font-medium mb-1">Steps</h2>
          {steps.map((step, i) => (
            <textarea
              key={i}
              className="w-full border p-2 rounded mb-2"
              placeholder={`Step ${i + 1}`}
              value={step}
              onChange={(e) => {
                const updated = [...steps];
                updated[i] = e.target.value;
                setSteps(updated);
              }}
            />
          ))}
          <button type="button" onClick={handleAddStep} className="text-blue-600 hover:underline">
            + Add Step
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Recipe
        </button>
      </form>
    </div>
    </AdminLayout>
  );
}
