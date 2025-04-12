export const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const routes = {
    login_url: `auth/login`,
    meal_plans: `api/v1/meal_plan/get/meal_plans/`,
    recipes: `api/v1/recipe/get/recipes`,
}

export default routes;