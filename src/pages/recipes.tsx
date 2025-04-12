import axiosInstance from "@/lib/axios"
import routes from "@/lib/routes"
import { useQuery } from "@tanstack/react-query"

type Recipe = {
  _id: string,
  image: string,
  title: string,
  readyInMinutes: number,
  servings: number,
  vegetarian: boolean,
  vegan: boolean,
  glutenFree: boolean,
  dairyFree: boolean,
  cheep: boolean
}

type Response = {
  recipes: Recipe[]
}

const fetchRecipes = async (): Promise<Response> => {
  const res = await axiosInstance.get(routes.recipes)
  return res.data
}

export default function Recipes() {
  const {data, isLoading, isError} = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  })

  return (
    <>
      <main className="max-w-5xl mx-auto px-6 py-12 min-h-dvh">
        <h1 className="text-4xl font-bold mb-4">Recipes</h1>
        <p className="text-gray-700 mb-4">
          Browse healthy and delicious recipes to fuel your body.
        </p>
        
        {isLoading && <p>Loading recipes...</p>}
        {isError && <p className="text-red-500">Failed to load recipes.</p>}

        {data && (
          <div className="grid gap-6 sm:grid-cols-2">
            {data.recipes.map((recipe) => (
              <div key={recipe._id} className="p-6 border rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
                <img src={recipe.image} alt={recipe.title} />
                <p className="text-gray-600 mb-4">Ready In: {recipe.readyInMinutes}</p>
                <p className="text-gray-600 mb-4">No of Servings: {recipe.servings}</p>
                <p className="text-gray-600 mb-4">{recipe.vegetarian && <>Vegetarian</>}</p>
                <p className="text-gray-600 mb-4">{recipe.vegan && <>Vegan</>}</p>
                <p className="text-gray-600 mb-4">{recipe.glutenFree && <>Gluten Free</>}</p>
                <p className="text-gray-600 mb-4">{recipe.dairyFree && <>Daily Free</>}</p>
                <p className="text-gray-600 mb-4">{recipe.cheep && <>Cheep</>}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
