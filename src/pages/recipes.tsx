import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Recipes() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12 min-h-dvh">
        <h1 className="text-4xl font-bold mb-4">Recipes</h1>
        <p className="text-gray-700 mb-4">
          Browse healthy and delicious recipes to fuel your body.
        </p>
        {/* TODO: Render recipe cards from backend */}
      </main>
      <Footer />
    </>
  );
}
