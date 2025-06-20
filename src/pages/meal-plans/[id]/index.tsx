'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import axiosInstance from '@/lib/axios'
import routes from '@/lib/routes'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

type MealPlanDetail = {
  _id: string
  title: string
  description: string
  summary: string
  private: boolean
  dailyPlans: {
    day: string
    recipes: Record<string, string> // time: recipeId
    summary: string
  }[]
}

type RecipesResponse = {
  recipes: {
    _id: string
    title: string
  }[]
}

const fetchMealPlan = async (id: string): Promise<MealPlanDetail> => {
  const res = await axiosInstance.get(routes.meal_plan(id))
  return res.data
}

const fetchRecipes = async (): Promise<RecipesResponse> => {
  const res = await axiosInstance.get(routes.recipes_list)
  return res.data
}

export default function MealPlanDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const { data: plan, isLoading, isError } = useQuery({
    queryKey: ['mealPlanDetail', id],
    queryFn: () => fetchMealPlan(id),
    enabled: !!id,
  })

  const { data: recipeData } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  })

  const getRecipeName = (recipeId: string) =>
    recipeData?.recipes.find((r) => r._id === recipeId)?.title || 'Loading...'

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12 min-h-dvh">
        {isLoading && <p>Loading meal plan...</p>}
        {isError && <p className="text-red-500">Error loading meal plan.</p>}

        {plan && (
          <>
            <h1 className="text-4xl font-bold mb-4">{plan.title}</h1>
            <p className="text-gray-700 mb-2">{plan.description}</p>
            <p className="text-sm italic text-gray-500 mb-6">{plan.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plan.dailyPlans.map((dayPlan, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white shadow-md rounded-xl border border-gray-100"
                >
                  <h2 className="text-lg font-semibold mb-2">
                    {new Date(dayPlan.day).toLocaleDateString()}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">
                    {dayPlan.summary}
                  </p>
                  <ul className="space-y-2">
                    {Object.entries(dayPlan.recipes)
                      .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
                      .map(([time, recipeId]) => (
                        <li key={time} className="flex justify-between">
                          <Link href={`/recipes/${recipeId}`}>
                            <span className="text-gray-600">{time}</span>
                            <span className="text-gray-800 font-medium">
                              {getRecipeName(recipeId)}
                            </span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
