
import PageTemplate from './PageTemplate';

const Reviews = () => {
  return (
    <PageTemplate title="Customer Reviews">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600">
            Read reviews from our verified customers.
          </p>
        </section>
      </div>
    </PageTemplate>
  );
};

export default Reviews;
