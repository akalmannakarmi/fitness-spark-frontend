import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Profile() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 min-h-dvh">
        <h1 className="text-4xl font-bold mb-4">My Profile</h1>
        <p className="text-gray-700 mb-4">
          Welcome back! Manage your meal plans, saved recipes, and account settings here.
        </p>
        {/* TODO: Display user data */}
      </main>
      <Footer />
    </>
  );
}
