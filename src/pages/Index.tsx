
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoBanner from '@/components/home/PromoBanner';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

const Index = () => {
  return (
    <MainLayout>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <Testimonials />
      <Newsletter />
    </MainLayout>
  );
};

export default Index;
