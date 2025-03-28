
import PageTemplate from './PageTemplate';

const TermsOfUse = () => {
  return (
    <PageTemplate title="Terms of Use">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Terms and Conditions</h2>
          <p className="text-gray-600">
            Please read these terms and conditions carefully before using our service.
          </p>
        </section>
      </div>
    </PageTemplate>
  );
};

export default TermsOfUse;
