
import PageTemplate from './PageTemplate';

const OrderStatus = () => {
  return (
    <PageTemplate title="Order Status">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Track Your Order</h2>
          <p className="text-gray-600">
            Enter your order number to check its current status and tracking information.
          </p>
        </section>
      </div>
    </PageTemplate>
  );
};

export default OrderStatus;
