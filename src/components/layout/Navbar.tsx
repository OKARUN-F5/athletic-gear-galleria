
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShoppingCart, Heart, User, Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  { name: 'Men', path: '/category/men' },
  { name: 'Women', path: '/category/women' },
  { name: 'Kids', path: '/category/kids' },
  { name: 'Accessories', path: '/category/accessories' },
  { name: 'Sale', path: '/category/sale' },
];

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-heading font-bold text-sport-blue-700"
          >
            SportyWear
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex space-x-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="text-sport-gray-700 hover:text-sport-blue transition-colors font-medium"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Icon */}
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/login" className="w-full cursor-pointer">Sign In</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/register" className="w-full cursor-pointer">Register</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="rounded-full relative" asChild>
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sport-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="rounded-full relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sport-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && isMobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-3 mt-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="text-sport-gray-700 hover:text-sport-blue transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
