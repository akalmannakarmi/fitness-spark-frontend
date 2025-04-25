import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import routes from "@/lib/routes";
import { toast } from "sonner";
import AdminLayout from "../../layout";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = router.query;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [groups, setGroups] = useState<string[]>([]);

  const { isLoading } = useQuery({
    queryKey: ["edit-user", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosInstance.get(routes.admin.user_detail(id as string));
      const userData = res.data;
      setUsername(userData.username);
      setEmail(userData.email);
      setGroups(userData.groups || []);
      return userData;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return axiosInstance.put(routes.admin.user_update(id as string), data);
    },
    onSuccess: () => {
      toast.success("User updated successfully!");
      router.push("/admin/users");
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setGroups(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      username,
      email,
      groups,
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit User</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
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
            <select
              multiple
              className="w-full border p-2 rounded h-32"
              value={groups}
              onChange={handleGroupChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              {/* Add more group options here if needed */}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update User
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
