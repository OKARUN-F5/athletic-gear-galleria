
import { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageTemplate from './PageTemplate';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useRegion } from "@/contexts/RegionContext";
import { useAuth } from "@/contexts/AuthContext";

// Mock cart data - in a real app this would come from a cart context/state
const initialCart = [
  {
    id: 1,
    name: "Classic Basketball Jersey",
    price: 79.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1515186813673-94dc5bf163c4?q=80&w=2940&auto=format&fit=crop",
    size: "L",
  },
  {
    id: 2,
    name: "Premium Team Sweatshirt",
    price: 89.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2940&auto=format&fit=crop",
    size: "M",
  },
];

const Cart = () => {
  const [cart, setCart] = useState(initialCart);
  const { toast } = useToast();
  const { getCurrencySymbol } = useRegion();
  const { user } = useAuth();
  const navigate = useNavigate();
  const currencySymbol = getCurrencySymbol();

  // Calculate cart totals
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const isEmpty = cart.length === 0;

  const handleQuantityChange = (itemId: number, action: 'increase' | 'decrease') => {
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        let newQuantity = item.quantity;
        if (action === 'increase') {
          newQuantity = item.quantity + 1;
        } else if (action === 'decrease' && item.quantity > 1) {
          newQuantity = item.quantity - 1;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCart(updatedCart);
    toast({
      title: "Cart updated",
      description: `Quantity ${action}d for ${cart.find(item => item.id === itemId)?.name}`,
    });
  };

  const handleRemoveItem = (itemId: number) => {
    const itemToRemove = cart.find(item => item.id === itemId);
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    
    toast({
      title: "Item removed",
      description: `${itemToRemove?.name} has been removed from your cart.`,
    });
  };

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to proceed to checkout.",
        variant: "destructive",
      });
      navigate('/sign-in');
      return;
    }
    
    navigate('/checkout');
  };

  return (
    <PageTemplate title="Shopping Cart">
      <div className="max-w-6xl mx-auto">
        {isEmpty ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
            {/* Cart Items */}
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 p-4 bg-white rounded-lg shadow-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{item.name}</h3>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, 'decrease')}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, 'increase')}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-semibold">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-center p-8">
                <Button asChild variant="outline">
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg h-fit space-y-6">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>

                <Button 
                  className="w-full"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <p className="text-sm text-gray-600 text-center">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Cart;
