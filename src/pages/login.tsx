import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Login() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col justify-center items-center min-h-dvh px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up instead
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
