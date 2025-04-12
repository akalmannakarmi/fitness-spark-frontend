import Link from "next/link";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useAuth } from '@/lib/auth'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, isAdmin } = useAuth()


  const navLinks = [
    { href: "/meal-plans", label: "Meal Plans" },
    { href: "/recipes", label: "Recipes" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    ...(isAdmin ? [{ href: "/admin", label: "Dashboard" }] : []),
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">Fitness Spark</h1>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <Link href="/profile" className="flex items-center gap-2 hover:text-blue-600">
              <User size={20} />
              Profile
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4">
          <ul className="space-y-4 text-gray-700 font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              {isLoggedIn ? (
                <Link href="/profile" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
