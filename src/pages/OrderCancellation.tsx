
import PageTemplate from './PageTemplate';

const OrderCancellation = () => {
  return (
    <PageTemplate title="Order Cancellation">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Cancel Your Order</h2>
          <p className="text-gray-600">
            Information about our order cancellation policy and process.
          </p>
        </section>
      </div>
    </PageTemplate>
  );
};

export default OrderCancellation;
