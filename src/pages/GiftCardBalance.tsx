
import PageTemplate from './PageTemplate';

const GiftCardBalance = () => {
  return (
    <PageTemplate title="Gift Card Balance">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Check Gift Card Balance</h2>
          <p className="text-gray-600">
            Enter your gift card number to check its current balance.
          </p>
        </section>
      </div>
    </PageTemplate>
  );
};

export default GiftCardBalance;
