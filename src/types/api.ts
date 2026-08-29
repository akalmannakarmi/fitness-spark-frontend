export type User = {
  _id: string;
  username: string;
  email: string;
  groups: string[];
};

export type UserCreate = {
  username: string;
  email: string;
  password: string;
  groups: string[];
};

export type UserUpdate = {
  username?: string;
  email?: string;
  password?: string;
  groups?: string[];
};

export type Token = {
  access_token: string;
  token_type: string;
  expires_at: number;
  admin: boolean;
};

export type Nutrient = {
  name: string;
  amount: number;
  unit: string;
};

export type Ingredient = {
  name: string;
  amount: number;
  unit: string;
};

export type Recipe = {
  _id: string;
  image: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  cheap: boolean;
};

export type RecipeDetail = Recipe & {
  nutrients: Nutrient[];
  ingredients: Ingredient[];
  steps: string[];
};

export type RecipeShort = {
  _id: string;
  title: string;
};

export type RecipeCreate = Omit<RecipeDetail, "_id">;

export type RecipeUpdate = Partial<RecipeCreate>;

export type RecipeFilters = {
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  cheap?: boolean;
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

export type MealPlan = {
  _id: string;
  user: string;
  title: string;
  description: string;
  summary: string;
  private: boolean;
};

export type DailyPlan = {
  day: string;
  recipes: Record<string, string>;
  summary: string;
};

export type MealPlanDetail = MealPlan & {
  dailyPlans: DailyPlan[];
};

export type MealPlanCreate = {
  title: string;
  description: string;
  summary: string;
  private: boolean;
  dailyPlans: DailyPlan[];
};

export type MealPlanUpdate = Partial<MealPlanCreate>;

export type Stat = {
  _id: string;
  model: string;
  count: number;
};

export type Paginated = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type UserList = Paginated & { users: User[] };
export type RecipeList = Paginated & { recipes: Recipe[] };
export type MealPlanList = Paginated & { meal_plans: MealPlan[] };
export type RecipeShortList = { recipes: RecipeShort[] };
