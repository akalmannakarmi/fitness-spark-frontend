export const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const routes = {
    signup_url: `auth/signup`,
    login_url: `auth/login`,
    meal_plans: `api/v1/meal_plan/get/meal_plans/`,
    recipes: `api/v1/recipe/get/recipes`,

    stats_url: `stats/models`,
    stat_detail_url: (id:string) => `stats/model/${id}`,
}

export default routes;