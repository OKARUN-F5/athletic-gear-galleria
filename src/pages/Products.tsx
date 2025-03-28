
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, Heart, SlidersHorizontal, Star } from 'lucide-react';
import PageTemplate from './PageTemplate';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRegion } from "@/contexts/RegionContext";

// Sample product data
const products = [
  {
    id: 1,
    name: "Classic Basketball Jersey",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1515186813673-94dc5bf163c4?q=80&w=2940&auto=format&fit=crop",
    category: "jerseys",
    brand: "Nike",
    rating: 4.5,
    color: "red",
    bestseller: true,
  },
  {
    id: 2,
    name: "Premium Team Sweatshirt",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2940&auto=format&fit=crop",
    category: "sweatshirts",
    brand: "Adidas",
    rating: 4.2,
    color: "blue",
    bestseller: false,
  },
  {
    id: 3,
    name: "Winter Warm Hoodie",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2936&auto=format&fit=crop",
    category: "hoodies",
    brand: "Puma",
    rating: 4.8,
    color: "black",
    bestseller: true,
  },
  {
    id: 4,
    name: "Breathable Running Jersey",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1564200504585-1128e7959c45?q=80&w=2940&auto=format&fit=crop",
    category: "jerseys",
    brand: "Nike",
    rating: 4.3,
    color: "green",
    bestseller: false,
  },
  {
    id: 5,
    name: "Mesh Basketball Jersey",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1562751362-404243c2eea3?q=80&w=2873&auto=format&fit=crop",
    category: "jerseys",
    brand: "Under Armour",
    rating: 4.1,
    color: "yellow",
    bestseller: false,
  },
  {
    id: 6,
    name: "Cotton Team Sweatshirt",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=2874&auto=format&fit=crop",
    category: "sweatshirts",
    brand: "Adidas",
    rating: 4.7,
    color: "gray",
    bestseller: true,
  }
];

const Products = () => {
  const { getCurrencySymbol } = useRegion();
  const currencySymbol = getCurrencySymbol();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State for filters
  const [categoryFilter, setCategoryFilter] = useState<string | null>(searchParams.get('category'));
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [bestsellerFilter, setBestsellerFilter] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState("featured");
  
  // Apply filters from URL params on component mount
  useEffect(() => {
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const color = searchParams.get('color');
    const bestseller = searchParams.get('bestseller');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort');
    
    if (category) setCategoryFilter(category);
    if (brand) setBrandFilter(brand);
    if (color) setColorFilter(color);
    if (bestseller === 'true') setBestsellerFilter(true);
    if (minPrice && maxPrice) setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);
    if (sort) setSortBy(sort);
  }, [searchParams]);
  
  // Update URL with filters
  const updateFilters = () => {
    const params = new URLSearchParams();
    if (categoryFilter) params.append('category', categoryFilter);
    if (brandFilter) params.append('brand', brandFilter);
    if (colorFilter) params.append('color', colorFilter);
    if (bestsellerFilter) params.append('bestseller', 'true');
    params.append('minPrice', priceRange[0].toString());
    params.append('maxPrice', priceRange[1].toString());
    params.append('sort', sortBy);
    setSearchParams(params);
  };
  
  // Apply filters when they change
  useEffect(() => {
    updateFilters();
  }, [categoryFilter, brandFilter, colorFilter, bestsellerFilter, priceRange, sortBy]);
  
  // Filter products based on all criteria
  const filteredProducts = products.filter(product => {
    if (categoryFilter && product.category !== categoryFilter) return false;
    if (brandFilter && product.brand !== brandFilter) return false;
    if (colorFilter && product.color !== colorFilter) return false;
    if (bestsellerFilter && !product.bestseller) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0; // Featured - no specific sort
    }
  });
  
  // Navigate to product detail
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };
  
  // Get unique filter options
  const brands = [...new Set(products.map(p => p.brand))];
  const colors = [...new Set(products.map(p => p.color))];
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <PageTemplate title="Our Products">
      <div className="container">
        {/* Filters and Sort */}
        <div className="flex items-center justify-between mb-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-100px)] py-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Categories</h3>
                    <div className="space-y-3">
                      <button
                        className={`block ${!categoryFilter ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}`}
                        onClick={() => setCategoryFilter(null)}
                      >
                        All
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category}
                          className={`block ${categoryFilter === category ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}`}
                          onClick={() => setCategoryFilter(category)}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-4">Price Range</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, 200]}
                        value={priceRange}
                        min={0}
                        max={200}
                        step={10}
                        onValueChange={(value: [number, number]) => setPriceRange(value)}
                        className="my-6"
                      />
                      <div className="flex justify-between text-sm">
                        <span>{currencySymbol}{priceRange[0]}</span>
                        <span>{currencySymbol}{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-4">Brands</h3>
                    <div className="space-y-3">
                      <button
                        className={`block ${!brandFilter ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}`}
                        onClick={() => setBrandFilter(null)}
                      >
                        All Brands
                      </button>
                      {brands.map((brand) => (
                        <button
                          key={brand}
                          className={`block ${brandFilter === brand ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}`}
                          onClick={() => setBrandFilter(brand)}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-4">Colors</h3>
                    <div className="space-y-3">
                      <button
                        className={`block ${!colorFilter ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}`}
                        onClick={() => setColorFilter(null)}
                      >
                        All Colors
                      </button>
                      {colors.map((color) => (
                        <div key={color} className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded-full bg-${color}-500`} />
                          <button
                            className={`${colorFilter === color ? 'text-black font-medium' : 'text-gray-600 hover:text-black'}`}
                            onClick={() => setColorFilter(color)}
                          >
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="bestseller" 
                      checked={bestsellerFilter}
                      onCheckedChange={(checked) => setBestsellerFilter(checked as boolean)}
                    />
                    <Label htmlFor="bestseller">Bestsellers Only</Label>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Desktop Filters Button */}
          <Button variant="outline" className="hidden lg:flex">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div 
              key={product.id} 
              className="group cursor-pointer" 
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button 
                  className="absolute top-4 right-4 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle wishlist functionality
                  }}
                >
                  <Heart className="h-5 w-5" />
                </button>
                {product.bestseller && (
                  <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                    BESTSELLER
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm">{product.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">({Math.floor(Math.random() * 100) + 10} reviews)</span>
                </div>
                <h3 className="font-semibold mt-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
                <p className="font-medium">{currencySymbol}{product.price}</p>
              </div>
            </div>
          ))}
        </div>
        
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters to find what you're looking for.</p>
            <Button onClick={() => {
              setCategoryFilter(null);
              setBrandFilter(null);
              setColorFilter(null);
              setBestsellerFilter(false);
              setPriceRange([0, 200]);
            }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Products;
