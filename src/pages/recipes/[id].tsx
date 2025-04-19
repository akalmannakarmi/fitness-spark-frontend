import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import routes from "@/lib/routes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Nutrient = {
  name: string;
  amount: number;
  unit: string;
};

type Ingredient = {
  name: string;
  amount: number;
  unit: string;
};

type Recipe = {
  _id: string;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  cheep: boolean;
  nutrients: Nutrient[];
  ingredients: Ingredient[];
  steps: string[];
};

const fetchRecipe = async (id: string): Promise<Recipe> => {
  const res = await axiosInstance.get(routes.recipe(id));
  return res.data;
};

export default function RecipeDetailPage() {
  const { query } = useRouter();
  const id = query.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipe(id),
    enabled: !!id,
  });

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError || !data) return <p className="text-red-500 p-4">Failed to load recipe.</p>;

  const { title, image, servings, readyInMinutes, nutrients, ingredients, steps } = data;

  const highlightNutrients = ["Calories", "Fat", "Protein", "Carbohydrates"];

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <img src={image} alt={title} className="rounded-lg my-6" />

        <div className="mb-6 text-gray-700">
          <p><strong>Ready In:</strong> {readyInMinutes} min</p>
          <p><strong>Servings:</strong> {servings}</p>

          <div className="flex gap-2 mt-2 text-sm">
            {data.vegetarian && <span className="bg-green-100 px-2 py-1 rounded">Vegetarian</span>}
            {data.vegan && <span className="bg-green-100 px-2 py-1 rounded">Vegan</span>}
            {data.glutenFree && <span className="bg-green-100 px-2 py-1 rounded">Gluten Free</span>}
            {data.dairyFree && <span className="bg-green-100 px-2 py-1 rounded">Dairy Free</span>}
            {data.cheep && <span className="bg-green-100 px-2 py-1 rounded">Cheap</span>}
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Nutritional Info</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {nutrients
              .filter(n => highlightNutrients.includes(n.name))
              .map(n => (
                <div key={n.name} className="bg-gray-100 p-3 rounded text-center">
                  <p className="font-bold">{n.amount.toFixed(1)} {n.unit}</p>
                  <p className="text-sm text-gray-600">{n.name}</p>
                </div>
              ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Ingredients</h2>
          <ul className="list-disc pl-6 text-gray-800">
            {ingredients.map((i, index) => (
              <li key={index}>{i.amount} {i.unit} {i.name}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Instructions</h2>
          <ol className="list-decimal pl-6 space-y-3 text-gray-800">
            {steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </>
  );
}
