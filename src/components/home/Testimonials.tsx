
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Marathon Runner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    content: "The running shoes I purchased from SportyWear have completely transformed my training. The comfort and support they provide is unmatched. I've shaved minutes off my marathon time!",
    rating: 5
  },
  {
    id: 2,
    name: 'Samantha Lee',
    role: 'Yoga Instructor',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    content: "As a yoga instructor, I need activewear that moves with me. SportyWear's leggings are fantastic - breathable, flexible, and they stay in place through every pose. I recommend them to all my students.",
    rating: 5
  },
  {
    id: 3,
    name: 'Marcus Rodriguez',
    role: 'CrossFit Athlete',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    content: "The quality of SportyWear's training gear is exceptional. I've put their shorts and t-shirts through intense CrossFit workouts, and they've held up perfectly. Great durability and comfort.",
    rating: 4
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-sport-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What Our Customers Say</h2>
        <p className="text-sport-gray-600 text-center max-w-2xl mx-auto mb-12">
          Don't just take our word for it - hear from athletes and fitness enthusiasts who love our products.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-semibold text-sport-gray-800">{testimonial.name}</h3>
                  <p className="text-sport-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-sport-gray-300'}`} 
                  />
                ))}
              </div>
              
              <p className="text-sport-gray-600 flex-grow">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
