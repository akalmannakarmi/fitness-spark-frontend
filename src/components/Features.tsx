type Feature = {
    title: string;
    description: string;
};
  
const features: Feature[] = [
    {
        title: "Custom Meal Plans",
        description: "Tailored to your goals – whether you're bulking, cutting, or maintaining.",
    },
    {
        title: "Tasty, Healthy Recipes",
        description: "Fuel your body with meals that are both nutritious and delicious.",
    },
    {
        title: "Progress Tracking",
        description: "Stay motivated with visual tracking and analytics.",
    },
];

export default function Features() {
    return (
        <section className="py-16 px-6 bg-white">
        <h3 className="text-3xl font-semibold text-center mb-10 text-gray-800">Why Choose Fitness Spark?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-xl shadow hover:shadow-lg transition">
                <h4 className="text-xl font-bold text-blue-600 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
            </div>
            ))}
        </div>
        </section>
    );
}
  