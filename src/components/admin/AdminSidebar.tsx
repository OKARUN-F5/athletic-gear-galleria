
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PackageIcon, ShoppingCart, Image, Users, Settings } from "lucide-react";

const sidebarItems = [
  { 
    title: "Dashboard", 
    path: "/admin", 
    icon: LayoutDashboard 
  },
  { 
    title: "Products", 
    path: "/admin/products", 
    icon: PackageIcon 
  },
  { 
    title: "Orders", 
    path: "/admin/orders", 
    icon: ShoppingCart 
  },
  { 
    title: "Hero Images", 
    path: "/admin/hero-images", 
    icon: Image 
  },
  { 
    title: "Category Images", 
    path: "/admin/category-images", 
    icon: Image 
  },
  { 
    title: "About Images", 
    path: "/admin/about-images", 
    icon: Image 
  },
  { 
    title: "Users", 
    path: "/admin/users", 
    icon: Users 
  },
  { 
    title: "Settings", 
    path: "/admin/settings", 
    icon: Settings 
  }
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r shrink-0 h-full">
      <div className="p-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav className="mt-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm hover:bg-gray-100 ${
                    isActive ? "bg-gray-100 text-primary border-l-4 border-primary" : ""
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
