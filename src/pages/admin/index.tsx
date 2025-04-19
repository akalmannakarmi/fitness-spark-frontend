import { useQuery } from "@tanstack/react-query";
import AdminLayout from "./layout";
import axiosInstance from "@/lib/axios";
import routes from "@/lib/routes";
import { AxiosError } from "axios";
import { useState } from "react";
import StatChart from "@/components/StatChart";

type Stat = {
  _id:string,
  model:string,
  count:number,
}

export default function AdminDashboard() {
  const [users,setUsers] = useState(0)
  const [plans,setPlans] = useState(0)
  const [recipes,setRecipes] = useState(0)
  const [stats,setStats] = useState(0)
  const [statIds, setStatIds] = useState<{ [model: string]: string }>({})

  useQuery({
    queryKey: ["campaign-detail"],
    queryFn: async () => {
      const res = await axiosInstance.get(routes.stats_url)
      if (res.data?.models) {
        const ids: { [model: string]: string } = {}
        res.data.models.forEach((stat: Stat) => {
          ids[stat.model] = stat._id
          if (stat.model === "users") setUsers(stat.count)
          else if (stat.model === "meal_plans") setPlans(stat.count)
          else if (stat.model === "recipes") setRecipes(stat.count)
          else if (stat.model === "statistics") setStats(stat.count)
        })
        setStatIds(ids)
      }
      return res.data
    },
  })
  
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-700 mb-6">Here’s what’s happening at a glance:</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl font-bold mt-2">{users}</p>
        </div>
        <div className="bg-green-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Meal Plans</h2>
          <p className="text-2xl font-bold mt-2">{plans}</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Recipes</h2>
          <p className="text-2xl font-bold mt-2">{recipes}</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Stats</h2>
          <p className="text-2xl font-bold mt-2">{stats}</p>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {statIds["users"] && <StatChart statId={statIds["users"]} label="Users" />}
        {statIds["meal_plans"] && <StatChart statId={statIds["meal_plans"]} label="Meal Plans" />}
        {statIds["recipes"] && <StatChart statId={statIds["recipes"]} label="Recipes" />}
        {statIds["statistics"] && <StatChart statId={statIds["statistics"]} label="Statistics" />}
      </div>

    </AdminLayout>
  );
}
