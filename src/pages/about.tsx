import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 min-h-dvh">
        <h1 className="text-4xl font-bold mb-4">About Fitness Spark</h1>
        <p className="text-gray-700">
          Fitness Spark was created to simplify healthy eating. We empower users to
          build sustainable habits with personalized meal planning and easy-to-make recipes.
        </p>
      </main>
      <Footer />
    </>
  );
}
