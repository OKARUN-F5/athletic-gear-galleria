
import PageTemplate from './PageTemplate';

const PrivacyPolicy = () => {
  return (
    <PageTemplate title="Privacy Policy">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Privacy Policy</h2>
          <p className="text-gray-600">
            Information about how we collect, use, and protect your personal data.
          </p>
        </section>
      </div>
    </PageTemplate>
  );
};

export default PrivacyPolicy;
