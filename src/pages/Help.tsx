
import PageTemplate from './PageTemplate';

const Help = () => {
  return (
    <PageTemplate title="Help Center">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">How can we help you?</h2>
          <p className="text-gray-600">
            Welcome to our Help Center. Here you'll find answers to common questions and solutions to popular issues.
          </p>
        </section>
      </div>
    </PageTemplate>
  );
};

export default Help;
