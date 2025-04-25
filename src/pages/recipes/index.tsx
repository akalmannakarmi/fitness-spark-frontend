import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import axiosInstance from "@/lib/axios"
import routes from "@/lib/routes"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useEffect, useState } from "react"

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
  recipes: Recipe[],
  page: number,
  limit: number,
  total: number,
  pages: number
}

type Filters = {
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  cheep?: boolean;
  min_readyInMinutes?: number;
  max_readyInMinutes?: number;
  include_ingredients?: string[];
  exclude_ingredients?: string[];
  nutrients?: {
    [key: string]: {
      min?: number;
      max?: number;
    };
  };
};

const booleanFilterKeys: (keyof Filters)[] = [
  'vegetarian',
  'vegan',
  'glutenFree',
  'dairyFree',
  'cheep',
];

const getLimitByWidth = (width: number) => {
  if (width >= 1280) return 12; // xl
  if (width >= 1024) return 9;  // lg
  if (width >= 768) return 6;   // md
  return 4;                     // sm
};

const useResponsiveLimit = () => {
  const [limit, setLimit] = useState(() => {
    if (typeof window !== "undefined") {
      return getLimitByWidth(window.innerWidth);
    }
    return 12;
  });

  useEffect(() => {
    const handleResize = () => {
      setLimit(getLimitByWidth(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return limit;
};

const fetchRecipes = async (
  page = 1,
  filters: Filters = {},
  limit: number
): Promise<Response> => {
  const res = await axiosInstance.get(routes.recipes, {
    params: {
      page,
      limit,
      ...filters
    },
  });
  return res.data;
};

export default function Recipes() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({});
  const limit = useResponsiveLimit();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['recipes', page, filters, limit],
    queryFn: () => fetchRecipes(page, filters, limit)
  });

  const handleFilterChange = (name: keyof Filters) => {
    setFilters((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto px-6 py-12 min-h-dvh">
        <h1 className="text-4xl font-bold mb-2">Recipes</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-10">
          {/* Sidebar Filters */}
          <aside className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <div className="flex flex-col gap-3">
              {booleanFilterKeys.map((key) => {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!filters[key]} // safely coerce to boolean
                      onChange={() => handleFilterChange(key)}
                      className="accent-green-600"
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
            <div className="mt-4">
              <label className="block mb-1 font-medium">Ready In Minutes</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 border px-2 py-1 rounded"
                  value={filters.min_readyInMinutes || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, min_readyInMinutes: e.target.value ? +e.target.value : undefined }))
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 border px-2 py-1 rounded"
                  value={filters.max_readyInMinutes || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, max_readyInMinutes: e.target.value ? +e.target.value : undefined }))
                  }
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block mb-1 font-medium">Include Ingredients</label>
              <input
                type="text"
                placeholder="e.g. garlic, egg"
                className="w-full border px-2 py-1 rounded"
                onBlur={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    include_ingredients: e.target.value.split(",").map(i => i.trim()).filter(Boolean)
                  }))
                }
              />
            </div>

            <div className="mt-4">
              <label className="block mb-1 font-medium">Exclude Ingredients</label>
              <input
                type="text"
                placeholder="e.g. flour, cheese"
                className="w-full border px-2 py-1 rounded"
                onBlur={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    exclude_ingredients: e.target.value.split(",").map(i => i.trim()).filter(Boolean)
                  }))
                }
              />
            </div>
            <div className="mt-4">
              <label className="block mb-1 font-medium">Calories</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 border px-2 py-1 rounded"
                  onBlur={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      nutrients: {
                        ...prev.nutrients,
                        Calories: {
                          ...prev.nutrients?.Calories,
                          min: e.target.value ? +e.target.value : undefined,
                        },
                      },
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 border px-2 py-1 rounded"
                  onBlur={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      nutrients: {
                        ...prev.nutrients,
                        Calories: {
                          ...prev.nutrients?.Calories,
                          max: e.target.value ? +e.target.value : undefined,
                        },
                      },
                    }))
                  }
                />
              </div>
            </div>
            <button
              onClick={() => {
                setFilters({});
                setPage(1);
              }}
              className="mt-4 text-sm text-red-500 hover:underline"
            >
              Clear All Filters
            </button>
          </aside>

          {/* Recipes Grid */}
          <section>
            {isLoading && <p>Loading recipes...</p>}
            {isError && <p className="text-red-500">Failed to load recipes.</p>}

            {data && (
              <>
                <div className="grid gap-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                  {data.recipes.map((recipe) => (
                    <Link
                      href={`/recipes/${recipe._id}`}
                      key={recipe._id}
                      className="p-6 border rounded-xl shadow hover:shadow-lg transition-shadow duration-200 block bg-white"
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-40 object-cover rounded-md mb-3"
                      />
                      <h2 className="text-lg font-semibold mb-1">{recipe.title}</h2>
                      <p className="text-sm text-gray-600">⏱ {recipe.readyInMinutes} mins · 🍽 {recipe.servings} servings</p>
                      <div className="mt-2 text-xs text-gray-500 space-y-1">
                        {recipe.vegetarian && <p>🥦 Vegetarian</p>}
                        {recipe.vegan && <p>🌱 Vegan</p>}
                        {recipe.glutenFree && <p>🚫 Gluten</p>}
                        {recipe.dairyFree && <p>🥛 Free</p>}
                        {recipe.cheep && <p>💰 Budget-friendly</p>}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm">Page {data.page} of {data.pages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, data.pages))}
                    disabled={page === data.pages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
