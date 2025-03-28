
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Minus, Plus, Star, ShoppingCart, Check } from 'lucide-react';
import PageTemplate from './PageTemplate';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useRegion } from "@/contexts/RegionContext";

// Sample product data - in a real app, this would come from an API call
const products = [
  {
    id: 1,
    name: "Classic Basketball Jersey",
    price: 79.99,
    images: [
      "https://images.unsplash.com/photo-1515186813673-94dc5bf163c4?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1562751362-404243c2eea3?q=80&w=2873&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564200504585-1128e7959c45?q=80&w=2940&auto=format&fit=crop",
    ],
    description: "This classic basketball jersey offers superior comfort and durability. Made with lightweight, breathable fabric to keep you cool during intense games.",
    features: [
      "Lightweight polyester fabric",
      "Moisture-wicking technology",
      "Heat-sealed team logo",
      "Machine washable"
    ],
    category: "jerseys",
    brand: "Nike",
    rating: 4.5,
    colors: ["red", "blue", "black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    reviews: [
      { id: 1, user: "Michael J.", rating: 5, comment: "Great quality jersey, fits perfectly!", date: "2023-08-15" },
      { id: 2, user: "Sarah T.", rating: 4, comment: "Nice material but runs a bit small.", date: "2023-07-22" },
      { id: 3, user: "David R.", rating: 5, comment: "Excellent product, would buy again!", date: "2023-06-10" }
    ]
  },
  {
    id: 2,
    name: "Premium Team Sweatshirt",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=2874&auto=format&fit=crop",
    ],
    description: "Stay warm and show your team spirit with this premium sweatshirt. Features a comfortable fit and durable construction.",
    features: [
      "80% cotton, 20% polyester blend",
      "Ribbed cuffs and hem",
      "Front kangaroo pocket",
      "Embroidered team logo"
    ],
    category: "sweatshirts",
    brand: "Adidas",
    rating: 4.2,
    colors: ["blue", "gray", "navy"],
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      { id: 1, user: "Jessica L.", rating: 4, comment: "Warm and comfortable, perfect for game days.", date: "2023-09-05" },
      { id: 2, user: "Robert K.", rating: 5, comment: "Great quality and fits as expected.", date: "2023-08-30" }
    ]
  },
  {
    id: 3,
    name: "Winter Warm Hoodie",
    price: 99.99,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2936&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2972&auto=format&fit=crop",
    ],
    description: "This winter hoodie combines style and warmth. The fleece lining provides excellent insulation for cold weather.",
    features: [
      "Heavy-weight fleece with soft lining",
      "Adjustable drawstring hood",
      "Front pouch pocket",
      "Ribbed cuffs and hem"
    ],
    category: "hoodies",
    brand: "Puma",
    rating: 4.8,
    colors: ["black", "gray", "olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    reviews: [
      { id: 1, user: "Thomas H.", rating: 5, comment: "Incredibly warm and comfortable!", date: "2023-09-10" },
      { id: 2, user: "Emily P.", rating: 5, comment: "Love this hoodie! Worth every penny.", date: "2023-08-28" },
      { id: 3, user: "Mark S.", rating: 4, comment: "Great quality but sleeves are a bit long.", date: "2023-07-15" }
    ]
  },
];

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { toast } = useToast();
  const { getCurrencySymbol } = useRegion();
  const currencySymbol = getCurrencySymbol();
  
  // Find the product based on the URL parameter
  const product = products.find(p => p.id === parseInt(productId || "0"));
  
  // If product isn't found, show error message
  if (!product) {
    return (
      <PageTemplate title="Product Not Found">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-6">The product you're looking for does not exist or has been removed.</p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </PageTemplate>
    );
  }
  
  // State for product details
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]); // Default to L
  const [quantity, setQuantity] = useState(1);
  
  // Calculate ratings data
  const averageRating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;
  const totalReviews = product.reviews.length;
  
  // Handle adding to cart
  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}, ${selectedColor}) has been added to your cart`,
    });
  };
  
  // Handle adding to wishlist
  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: "This item has been added to your wishlist",
    });
  };
  
  // Get related products (excluding current product)
  const relatedProducts = products
    .filter(p => p.id !== product.id && 
      (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);
    
  // Handle quantity changes
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) 
            ? "fill-yellow-400 text-yellow-400" 
            : index < rating 
              ? "fill-yellow-400 text-yellow-400 fill-opacity-50" 
              : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <PageTemplate title={product.name}>
      <div className="container pb-16">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link to="/products" className="flex items-center text-gray-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
        
        {/* Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img 
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex gap-2 overflow-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`flex-none w-20 h-20 rounded-md overflow-hidden ${
                    mainImage === img ? 'ring-2 ring-black' : 'opacity-70'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {renderStars(averageRating)}
                </div>
                <span className="text-sm text-gray-600">({totalReviews} reviews)</span>
              </div>
              <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
              <p className="text-xl font-semibold mt-2">{currencySymbol}{product.price}</p>
              <p className="text-sm text-gray-500 mt-1">Brand: {product.brand}</p>
            </div>
            
            <p className="text-gray-700">{product.description}</p>
            
            {/* Color Selection */}
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex space-x-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedColor === color ? 'ring-2 ring-black ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && <Check className="h-5 w-5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Size</h3>
                <Link to="/size-guide" className="text-sm underline">Size Guide</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-10 flex items-center justify-center border rounded ${
                      selectedSize === size 
                        ? 'bg-black text-white border-black' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center w-32">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={increaseQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4 pt-2">
              <Button 
                className="flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleAddToWishlist}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Features */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Tabs: Description and Reviews */}
        <div className="mt-16">
          <Tabs defaultValue="reviews">
            <TabsList className="mb-8">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({totalReviews})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-6">
              <h2 className="text-2xl font-semibold">Product Description</h2>
              <p className="text-gray-700">{product.description}</p>
              <h3 className="text-xl font-semibold">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Customer Reviews</h2>
                  <Button>Write a Review</Button>
                </div>
                
                {/* Review Summary */}
                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                    <div className="flex my-1 justify-center">
                      {renderStars(averageRating)}
                    </div>
                    <div className="text-sm text-gray-600">Based on {totalReviews} reviews</div>
                  </div>
                  <Separator orientation="vertical" className="h-16" />
                  <div className="flex-1">
                    {/* We could add a breakdown of ratings (5 star, 4 star, etc.) here */}
                    <p className="text-gray-700">Customers love the comfort and style of this product.</p>
                  </div>
                </div>
                
                {/* Individual Reviews */}
                <div className="space-y-6">
                  {product.reviews.map(review => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <span className="font-medium">{review.user}</span>
                        <span className="text-gray-500 text-sm ml-2">· {review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(item => (
              <div key={item.id} className="group">
                <Link to={`/product/${item.id}`} className="block">
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <button 
                      className="absolute top-4 right-4 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle wishlist functionality
                      }}
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(item.rating)}
                      </div>
                    </div>
                    <h3 className="font-semibold mt-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{item.brand}</p>
                    <p className="font-medium">{currencySymbol}{item.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ProductDetail;
