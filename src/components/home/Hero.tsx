
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-sport-gray-900 text-white">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-sport-blue-900/90 to-sport-blue-800/70"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
            opacity: 0.9
          }}
        />
      </div>
      
      <div className="container-custom relative z-10 py-24 md:py-32">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Elevate Your Performance with Premium Sportswear
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Discover our collection of high-quality athletic apparel designed for maximum comfort and performance.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-sport-blue hover:bg-sport-blue-600 text-white" asChild>
              <Link to="/category/featured">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-sport-blue-800" asChild>
              <Link to="/collections">Explore Collections</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
