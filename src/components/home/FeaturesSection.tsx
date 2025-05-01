
import { Shield, Truck, Clock, PersonStanding, Zap } from "lucide-react";

const features = [
  {
    icon: <Shield className="w-10 h-10 text-forest-700" />,
    title: "Quality Assurance",
    description: "All our products go through rigorous quality checks to ensure long-lasting performance."
  },
  {
    icon: <Truck className="w-10 h-10 text-forest-700" />,
    title: "Prompt Delivery",
    description: "Fast and reliable delivery across Bangalore with options for scheduled installations."
  },
  {
    icon: <Clock className="w-10 h-10 text-forest-700" />,
    title: "Experience",
    description: "Over 15 years of experience providing premium timber solutions in Bangalore."
  },
  {
    icon: <PersonStanding className="w-10 h-10 text-forest-700" />,
    title: "Expert Advice",
    description: "Our consultants help you choose the right wood for your specific requirements."
  },
  {
    icon: <Zap className="w-10 h-10 text-forest-700" />,
    title: "Custom Solutions",
    description: "Tailor-made timber solutions for both residential and commercial projects."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-timber-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose South Indian Timbers?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're committed to providing quality timber products with exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
