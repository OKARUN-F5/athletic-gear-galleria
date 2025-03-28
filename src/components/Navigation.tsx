
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/c29fc710-b054-4796-a64b-4cdebddf432f.png"
                alt="Plug Logo"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/size-guide" className="nav-link">Size Guide</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            {isAdmin && (
              <Link to="/admin" className="nav-link flex items-center text-primary">
                <LayoutDashboard className="mr-1 h-4 w-4" />
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/sign-in">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/products"
              className="block px-3 py-2 text-base font-medium hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/size-guide"
              className="block px-3 py-2 text-base font-medium hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Size Guide
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-base font-medium hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="block px-3 py-2 text-base font-medium text-primary hover:bg-gray-50 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Admin Dashboard
              </Link>
            )}

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-base font-medium hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-3 py-2 text-base font-medium hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/wishlist"
                  className="block px-3 py-2 text-base font-medium hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 text-base font-medium hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  className="flex items-center w-full px-3 py-2 text-base font-medium hover:bg-gray-50 text-left"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/sign-in"
                className="block px-3 py-2 text-base font-medium hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
            )}
            
            <Link
              to="/cart"
              className="block px-3 py-2 text-base font-medium hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Cart
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
