export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const routes = {
  signupUrl: `auth/signup`,
  loginUrl: `auth/login`,
  userInfo: `auth/users/me`,
  mealPlans: `api/v1/meal_plan/get/meal_plans`,
  mealPlan: (id: string) => `api/v1/meal_plan/get/meal_plan/${id}`,
  recipes: `api/v1/recipe/get/recipes`,
  recipesList: `api/v1/recipe/list/recipes`,
  recipe: (id: string) => `api/v1/recipe/get/recipe/${id}`,

  statsUrl: `stats/models`,
  statDetailUrl: (id: string) => `stats/model/${id}`,

  admin: {
    recipes: `api/v1/admin/get/recipes`,
    recipe: (id: string) => `api/v1/admin/get/recipe/${id}`,
    recipeCreate: `api/v1/admin/create/recipe`,
    recipeUpdate: (id: string) => `api/v1/admin/update/recipe/${id}`,
    recipeDelete: (id: string) => `api/v1/admin/delete/recipe/${id}`,

    users: `auth/admin/get/users`,
    userDetail: (id: string) => `auth/admin/get/user/${id}`,
    userCreate: `auth/admin/create/user`,
    userUpdate: (id: string) => `auth/admin/update/user/${id}`,
    userDelete: (id: string) => `auth/admin/delete/user/${id}`,

    mealPlans: `api/v1/admin/get/meal_plans`,
    mealPlan: (id: string) => `api/v1/admin/get/meal_plan/${id}`,
    mealPlanCreate: `api/v1/admin/create/meal_plan`,
    mealPlanUpdate: (id: string) => `api/v1/admin/update/meal_plan/${id}`,
    mealPlanDelete: (id: string) => `api/v1/admin/delete/meal_plan/${id}`,
  },
};

export default routes;
