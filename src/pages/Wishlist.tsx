
import PageTemplate from './PageTemplate';

const Wishlist = () => {
  return (
    <PageTemplate title="Your Wishlist">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Saved Items</h2>
          <p className="text-gray-600">
            View and manage your wishlist items.
          </p>
        </section>
      </div>
    </PageTemplate>
  );
};

export default Wishlist;
