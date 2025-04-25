import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react"; // Optional icons for hamburger

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/meal-plans", label: "Meal Plans" },
    { href: "/admin/recipes", label: "Recipes" },
    { href: "/admin/site-content", label: "Site Content" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-0 z-50 bg-gray-600 bg-opacity-50 md:bg-opacity-0 md:static md:w-64 p-6 border-r transition-all ease-in-out duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="md:flex md:flex-col">
          <h2 className="text-xl font-bold mb-6 text-blue-600">Admin Panel</h2>
          <nav className="space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded hover:bg-blue-100 transition ${
                  pathname === link.href ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-16 p-8 transition-all duration-300">
        <div className="md:hidden flex justify-end">
          <button
            className="text-2xl text-blue-600"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
