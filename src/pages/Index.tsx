import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRegion } from "@/contexts/RegionContext";
import { HeroSlideshow } from "@/components/HeroSlideshow";

const Index = () => {
  const { getCurrencySymbol } = useRegion();
  const currencySymbol = getCurrencySymbol();

  return (
    <div className="animate-fadeIn">
      {/* Hero Section with Slideshow */}
      <section className="relative h-[80vh]">
        <HeroSlideshow />
        <div className="container absolute inset-0 flex items-center z-10">
          <div className="max-w-2xl animate-slideUp">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Premium Sports Jerseys
            </h1>
            <p className="text-xl mb-8 text-white">
              Authentic designs, superior quality, and unmatched style.
            </p>
            <Button asChild className="hero-button group">
              <Link to="/products">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Jerseys', 
                image: 'https://images.unsplash.com/photo-1617102888614-ae5c7c90d7eb?q=80&w=2940&auto=format&fit=crop',
                path: '/products?category=jerseys'
              },
              { 
                name: 'Sweatshirts', 
                image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2940&auto=format&fit=crop',
                path: '/products?category=sweatshirts'
              },
              { 
                name: 'Hoodies and Jackets', 
                image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2936&auto=format&fit=crop',
                path: '/products?category=hoodies'
              }
            ].map((category) => (
              <div key={category.name} className="group">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100">
                    <Heart className="h-5 w-5" />
                  </button>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button asChild variant="secondary">
                      <Link to={category.path}>View Collection</Link>
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600">
                    Explore our {category.name.toLowerCase()} collection - From {currencySymbol}59.99
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Size Guide Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Find Your Perfect Fit</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 mb-8">
              Use our comprehensive size guide to ensure you get the perfect fit. 
              We provide detailed measurements for all our products.
            </p>
            <Button asChild variant="outline">
              <Link to="/size-guide">View Size Guide</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-20 pb-10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Customer Help Center */}
            <div>
              <h3 className="font-bold mb-6">Customer Help Center</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Get Help', path: '/help' },
                  { name: 'Order Status', path: '/order-status' },
                  { name: 'Shipping and Delivery', path: '/shipping' },
                  { name: 'Order Cancellation', path: '/order-cancellation' },
                  { name: 'Payment Options', path: '/payment-options' },
                  { name: 'Contact Us', path: '/contact' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-gray-400 hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Policies */}
            <div>
              <h3 className="font-bold mb-6">Legal & Policies</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Privacy Policy', path: '/privacy-policy' },
                  { name: 'Terms of Use', path: '/terms-of-use' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-gray-400 hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shopping & Orders */}
            <div>
              <h3 className="font-bold mb-6">Shopping & Orders</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Sign In', path: '/sign-in' },
                  { name: 'Wishlist', path: '/wishlist' },
                  { name: 'Order Setup', path: '/order-setup' },
                  { name: 'Checkout', path: '/checkout' },
                  { name: 'Pickup & Delivery Options', path: '/pickup-delivery' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-gray-400 hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Reviews */}
            <div>
              <h3 className="font-bold mb-6">Customer Reviews</h3>
              <Link to="/reviews" className="text-gray-400 hover:text-white transition-colors">
                View All Reviews
              </Link>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-8 border-t border-gray-800 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2025 Plug Jerseys. All Rights Reserved
              </div>
              <div className="flex space-x-6">
                <Link to="/terms-of-use" className="text-gray-400 hover:text-white text-sm">Terms of Use</Link>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
