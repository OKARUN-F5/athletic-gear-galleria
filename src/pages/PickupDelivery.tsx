
import PageTemplate from './PageTemplate';

const PickupDelivery = () => {
  return (
    <PageTemplate title="Pickup & Delivery Options">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Choose Your Delivery Method</h2>
          <p className="text-gray-600">
            Select between in-store pickup or delivery to your location.
          </p>
        </section>
      </div>
    </PageTemplate>
  );
};

export default PickupDelivery;
