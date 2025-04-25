import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import routes from "@/lib/routes";
import { toast } from "sonner";
import AdminLayout from "../layout";

export default function CreateUserPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [groups, setGroups] = useState<string[]>([]); // multiple groups

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return axiosInstance.post(routes.admin.user_create, data);
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
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setGroups(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      username: name,
      email,
      password,
      groups,
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            <option value="user">User</option>
            <option value="admin">Admin</option>
            {/* Add more groups here if needed */}
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
