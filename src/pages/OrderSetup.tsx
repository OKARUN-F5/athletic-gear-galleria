
import PageTemplate from './PageTemplate';

const OrderSetup = () => {
  return (
    <PageTemplate title="Order Setup">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Setup Your Order</h2>
          <p className="text-gray-600">
            Configure your order preferences and shipping details.
          </p>
        </section>
      </div>
    </PageTemplate>
  );
};

export default OrderSetup;
