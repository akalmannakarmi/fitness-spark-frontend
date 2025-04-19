export const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const routes = {
    signup_url: `auth/signup`,
    login_url: `auth/login`,
    meal_plans: `api/v1/meal_plan/get/meal_plans/`,
    recipes: `api/v1/recipe/get/recipes`,
    recipe: (id:string) => `api/v1/recipe/get/recipe/${id}`,

    stats_url: `stats/models`,
    stat_detail_url: (id:string) => `stats/model/${id}`,

    admin: {
        recipes: `/api/v1/admin/get/recipes/`,
        recipe: (id:string) => `/api/v1/admin/get/recipe/${id}`,
        recipe_create: `/api/v1/admin/create/recipe/`,
        recipe_update: (id:string) => `/api/v1/admin/update/recipe/${id}`,
        recipe_delete: (id:string) => `/api/v1/admin/delete/recipe/${id}`,

        mealPlans: `/api/v1/admin/get/meal_plans/`,
        mealPlan: (id:string) => `/api/v1/admin/get/meal_plan/${id}`,
        mealPlan_create: `/api/v1/admin/create/meal_plan/`,
        mealPlan_update: (id:string) => `/api/v1/admin/update/meal_plan/${id}`,
        mealPlan_delete: (id:string) => `/api/v1/admin/delete/meal_plan/${id}`,
    }
}

export default routes;