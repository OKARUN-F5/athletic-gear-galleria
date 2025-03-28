
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { RegionProvider } from "@/contexts/RegionContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Help from "./pages/Help";
import OrderStatus from "./pages/OrderStatus";
import Shipping from "./pages/Shipping";
import OrderCancellation from "./pages/OrderCancellation";
import PaymentOptions from "./pages/PaymentOptions";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Wishlist from "./pages/Wishlist";
import OrderSetup from "./pages/OrderSetup";
import Checkout from "./pages/Checkout";
import PickupDelivery from "./pages/PickupDelivery";
import Reviews from "./pages/Reviews";
import SizeGuide from "./pages/SizeGuide";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";
// Admin Import
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminHeroImages from "./pages/admin/AdminHeroImages";
import AdminCategoryImages from "./pages/admin/AdminCategoryImages";
import AdminAboutImages from "./pages/admin/AdminAboutImages";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RegionProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-grow pt-16">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:productId" element={<ProductDetail />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/order-status" element={<OrderStatus />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/order-cancellation" element={<OrderCancellation />} />
                    <Route path="/payment-options" element={<PaymentOptions />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-use" element={<TermsOfUse />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/order-setup" element={<OrderSetup />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/pickup-delivery" element={<PickupDelivery />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/size-guide" element={<SizeGuide />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/settings" element={<Settings />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/hero-images" element={<AdminHeroImages />} />
                    <Route path="/admin/category-images" element={<AdminCategoryImages />} />
                    <Route path="/admin/about-images" element={<AdminAboutImages />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </RegionProvider>
    </QueryClientProvider>
  );
}

export default App;
