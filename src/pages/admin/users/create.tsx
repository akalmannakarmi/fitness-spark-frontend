import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import routes from "@/lib/routes";
import { toast } from "sonner";
import AdminLayout from "../layout";
import type { UserCreate } from "@/types/api";

const GROUP_OPTIONS = ["user", "admin"];

export default function CreateUserPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [groups, setGroups] = useState<string[]>([]);

  const createMutation = useMutation({
    mutationFn: async (data: UserCreate) => {
      return axiosInstance.post(routes.admin.userCreate, data);
    },
    onSuccess: () => {
      toast.success("User created successfully!");
      router.push("/admin/users");
    },
    onError: () => {
      toast.error("Failed to create user");
    },
  });

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setGroups(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ username, email, password, groups });
  };

  return (
    <AdminLayout>
      <div className="p-6 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select
            multiple
            className="w-full border p-2 rounded h-32"
            value={groups}
            onChange={handleGroupChange}
          >
            {GROUP_OPTIONS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create User
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
