
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock product data - in a real app, this would come from an API
const mockProducts = [
  {
    id: 1,
    name: 'Performance Running Shoes',
    category: 'Footwear',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80',
    rating: 4.5,
    isNew: true,
  },
  {
    id: 2,
    name: 'Elite Training Shorts',
    category: 'Men',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80',
    rating: 4.3,
    isNew: false,
  },
  {
    id: 3,
    name: 'Pro Compression Leggings',
    category: 'Women',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1536337005238-94b997371b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80',
    rating: 4.8,
    isNew: false,
  },
  {
    id: 4,
    name: 'Lightweight Running Jacket',
    category: 'Outerwear',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80',
    rating: 4.2,
    isNew: true,
  },
  {
    id: 5,
    name: 'Premium Yoga Mat',
    category: 'Accessories',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80',
    rating: 4.6,
    isNew: false,
  },
  {
    id: 6,
    name: 'Breathable Training Tee',
    category: 'Men',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80',
    rating: 4.4,
    isNew: false,
  },
  {
    id: 7,
    name: 'Seamless Sports Bra',
    category: 'Women',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1577655195787-7c785c9d3ef1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80',
    rating: 4.7,
    isNew: true,
  },
  {
    id: 8,
    name: 'Adjustable Dumbbell Set',
    category: 'Equipment',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1590771998996-8589ec9b5ac6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80',
    rating: 4.9,
    isNew: false,
  }
];

const ProductCard = ({ product }: { product: typeof mockProducts[0] }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="product-card group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-image group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Wishlist button */}
          <button 
            onClick={toggleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-colors duration-200 z-10"
          >
            <Heart 
              className={`w-5 h-5 ${isWishlisted ? 'fill-sport-red text-sport-red' : 'text-sport-gray-500'}`} 
            />
          </button>
          
          {/* New tag */}
          {product.isNew && (
            <div className="absolute top-3 left-3 bg-sport-blue text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="text-sm text-sport-gray-500 mb-1">{product.category}</div>
          <h3 className="font-medium text-sport-gray-800 mb-1 group-hover:text-sport-blue transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-semibold">${product.price.toFixed(2)}</span>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-sport-gray-600 ml-1">{product.rating}</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <Button className="w-full bg-sport-blue hover:bg-sport-blue-600">
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

const FeaturedProducts = () => {
  return (
    <section className="py-16">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Products</h2>
        <p className="text-sport-gray-600 text-center max-w-2xl mx-auto mb-12">
          Discover our handpicked selection of premium sportswear and equipment for your active lifestyle.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
