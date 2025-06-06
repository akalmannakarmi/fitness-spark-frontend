export const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const routes = {
    signup_url: `auth/signup`,
    login_url: `auth/login`,
    user_info: `auth/users/me`,
    meal_plans: `api/v1/meal_plan/get/meal_plans/`,
    meal_plan: (id:string) => `api/v1/meal_plan/get/meal_plan/${id}`,
    recipes: `api/v1/recipe/get/recipes`,
    recipes_list: `api/v1/recipe/list/recipes`,
    recipe: (id:string) => `api/v1/recipe/get/recipe/${id}`,

    stats_url: `stats/models`,
    stat_detail_url: (id:string) => `stats/model/${id}`,

    admin: {
        recipes: `/api/v1/admin/get/recipes/`,
        recipe: (id:string) => `/api/v1/admin/get/recipe/${id}`,
        recipe_create: `/api/v1/admin/create/recipe/`,
        recipe_update: (id:string) => `/api/v1/admin/update/recipe/${id}`,
        recipe_delete: (id:string) => `/api/v1/admin/delete/recipe/${id}`,

        users: `/auth/admin/get/users/`,
        user_detail: (id:string) => `/auth/admin/get/user/${id}`,
        user_create: `/auth/admin/create/user/`,
        user_update: (id:string) => `/auth/admin/update/user/${id}`,
        user_delete: (id:string) => `/auth/admin/delete/user/${id}`,

        mealPlans: `/api/v1/admin/get/meal_plans/`,
        mealPlan: (id:string) => `/api/v1/admin/get/meal_plan/${id}`,
        mealPlan_create: `/api/v1/admin/create/meal_plan/`,
        mealPlan_update: (id:string) => `/api/v1/admin/update/meal_plan/${id}`,
        mealPlan_delete: (id:string) => `/api/v1/admin/delete/meal_plan/${id}`,
    }
}

export default routes;