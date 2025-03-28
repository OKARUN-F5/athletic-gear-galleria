
import PageTemplate from './PageTemplate';

const Shipping = () => {
  return (
    <PageTemplate title="Shipping and Delivery">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          <p className="text-gray-600">
            Find details about shipping methods, delivery times, and tracking your package.
          </p>
        </section>
      </div>
    </PageTemplate>
  );
};

export default Shipping;
