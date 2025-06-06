'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios'
import routes from '@/lib/routes'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type MealPlan = {
  _id: string
  title: string
  description: string
  summary: string
  private: boolean
}

type Response = {
  meal_plans: MealPlan[]
}

const fetchMealPlans = async (): Promise<Response> => {
  const res = await axiosInstance.get(routes.meal_plans)
  return res.data
}

export default function MealPlans() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: fetchMealPlans,
  })

  return (
    <>
      <Navbar />
      <main className="mx-auto px-6 py-12 min-h-dvh">
        <h1 className="text-4xl font-bold mb-4">Meal Plans</h1>
        <p className="text-gray-700 mb-8">
          Explore personalized meal plans tailored to your goals.
        </p>

        {isLoading && <p>Loading meal plans...</p>}
        {isError && <p className="text-red-500">Failed to load meal plans.</p>}

        {data && (
          <div className="grid gap-6 sm:grid-cols-2">
            {data.meal_plans.map((plan) => (
              <Link
                key={plan._id}
                href={`/meal-plans/${plan._id}`}
                className="p-6 border rounded-lg shadow-sm hover:bg-gray-50 transition"
              >
                <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <p className="text-gray-500 text-sm italic">{plan.summary}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
