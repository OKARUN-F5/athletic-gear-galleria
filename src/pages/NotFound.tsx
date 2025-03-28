
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="py-20 md:py-28 container-custom">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-sport-blue mb-6">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-sport-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or doesn't exist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/category/featured">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
