
import PageTemplate from './PageTemplate';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <PageTemplate title="About Us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative h-[400px] rounded-2xl overflow-hidden mb-16">
          <img
            src="https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?q=80&w=2940&auto=format&fit=crop"
            alt="Football Stadium"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl text-white font-bold text-center">
              Crafting Quality Sports Apparel
            </h1>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-600 text-lg">
            We are dedicated to providing sports enthusiasts with premium quality jerseys and apparel 
            that combine authentic designs, superior materials, and unmatched craftsmanship.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Quality Materials",
              description: "We use only the finest materials to ensure comfort and durability in every product."
            },
            {
              title: "Authentic Designs",
              description: "Our designs stay true to team heritage while incorporating modern style elements."
            },
            {
              title: "Customer First",
              description: "We prioritize customer satisfaction with excellent service and support."
            }
          ].map((feature) => (
            <div key={feature.title} className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2024, we started with a simple goal: to create high-quality sports apparel 
                that fans would be proud to wear. Our journey began with a small collection of football jerseys 
                and has grown to include a wide range of sports apparel.
              </p>
              <p>
                Today, we continue to expand our collection while maintaining our commitment to quality 
                and authenticity. Every product we create is designed with the fan in mind, ensuring 
                comfort, style, and durability.
              </p>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=2787&auto=format&fit=crop"
              alt="Our Story"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6">Ready to Shop?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our collection of premium sports apparel and find your perfect match.
          </p>
          <Button asChild size="lg">
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default About;
