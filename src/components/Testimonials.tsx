const testimonials = [
    {
      name: "Jake R.",
      quote: "Fitness Spark helped me hit my macros without overthinking. I’ve never felt more in control!",
    },
    {
      name: "Sarah L.",
      quote: "I love how easy the recipes are. Meal planning used to stress me out, but not anymore!",
    },
];
  
export default function Testimonials() {
    return (
      <section className="bg-gray-50 py-16 px-6">
        <h3 className="text-3xl font-semibold text-center mb-10 text-gray-800">What Users Are Saying</h3>
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          {testimonials.map((t, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-700 italic">&quot;{t.quote}&quot;</p>
              <p className="text-sm text-gray-500 mt-4 text-right">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>
    );
}
  