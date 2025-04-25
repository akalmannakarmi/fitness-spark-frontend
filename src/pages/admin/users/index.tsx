import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/pages/admin/layout";
import axiosInstance from "@/lib/axios";
import routes from "@/lib/routes";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useState } from "react";

type User = {
  _id: string;
  username: string;
  email: string;
  groups: string[];
};

export default function AdminUsers() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users", search, page, limit],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `${routes.admin.users}?search=${search}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });

  const useDeleteUser = () =>
    useMutation({
      mutationFn: async (id: string) => {
        await axiosInstance.delete(routes.admin.user_delete(id));
      },
      onSuccess: () => {
        toast.success("User deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      },
      onError: () => {
        toast.error("Failed to delete user.");
      },
    });

  const deleteMutation = useDeleteUser();

  const handleEdit = (id: string) => {
    router.replace(`/admin/users/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-gray-600">Search, update, or remove users.</p>
        </div>
        <button
          onClick={() => router.push("/admin/users/create")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create User
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by username..."
          className="px-4 py-2 border rounded w-full md:w-1/3"
        />
      </div>

      {isLoading && <p>Loading users...</p>}
      {error && <p className="text-red-500">Error loading users.</p>}

      {!isLoading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-600">
                  <th className="p-3 border-b">Username</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Groups</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user: User) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50 text-sm">
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.groups.join(", ")}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(user._id)}
                          className="flex items-center px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="flex items-center px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2 py-1">
              Page {data.page} of {data.pages}
            </span>
            <button
              disabled={page === data.pages}
              onClick={() => setPage((prev) => Math.min(data.pages, prev + 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
