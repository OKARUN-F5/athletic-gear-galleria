
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PromoBanner = () => {
  return (
    <section className="py-16 bg-sport-blue text-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Summer Sale Is Now Live!</h2>
            <p className="text-blue-100 text-lg mb-6">
              Enjoy up to 50% off on selected items. Limited time offer - shop now and save big on premium sportswear.
            </p>
            <Button size="lg" className="bg-white text-sport-blue hover:bg-blue-50" asChild>
              <Link to="/category/sale">Shop the Sale</Link>
            </Button>
          </div>
          <div className="w-full md:w-auto">
            <div className="bg-sport-blue-600 rounded-lg p-6 md:p-8 text-center">
              <div className="text-5xl md:text-6xl font-bold mb-2">50% OFF</div>
              <div className="text-xl font-semibold mb-4">Premium Sportswear</div>
              <div className="text-blue-200 mb-3">Use Code:</div>
              <div className="bg-white text-sport-blue-700 font-bold py-2 px-4 rounded-md text-xl tracking-wider mb-4">
                SUMMER50
              </div>
              <div className="text-sm text-blue-200">
                Valid until August 31, 2023
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
