
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'men',
    name: 'Men',
    description: 'Performance wear for every sport',
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80',
    link: '/category/men'
  },
  {
    id: 'women',
    name: 'Women',
    description: 'Stylish activewear for your workout',
    image: 'https://images.unsplash.com/photo-1516526995003-435ccce2be97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80',
    link: '/category/women'
  },
  {
    id: 'kids',
    name: 'Kids',
    description: 'Durable gear for active kids',
    image: 'https://images.unsplash.com/photo-1543355238-61a4491f941e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80',
    link: '/category/kids'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Complete your athletic look',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80',
    link: '/category/accessories'
  }
];

const CategoryGrid = () => {
  return (
    <section className="py-16 bg-sport-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Shop by Category</h2>
        <p className="text-sport-gray-600 text-center max-w-2xl mx-auto mb-12">
          Find the perfect sportswear for your needs, whether you're hitting the gym, running trails, or just staying active day-to-day.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={category.link}
              className="group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-200">{category.description}</p>
                  <span className="mt-2 inline-block text-sport-blue-300 group-hover:text-sport-blue-200 transition-colors">
                    Shop Now →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
