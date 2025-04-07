import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MealPlans() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12 min-h-dvh">
        <h1 className="text-4xl font-bold mb-4">Meal Plans</h1>
        <p className="text-gray-700 mb-4">
          Explore personalized meal plans tailored to your goals.
        </p>
        {/* TODO: Render meal plans from backend */}
      </main>
      <Footer />
    </>
  );
}
