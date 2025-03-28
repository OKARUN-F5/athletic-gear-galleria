
import PageTemplate from './PageTemplate';
import { Card, CardContent } from "@/components/ui/card";

const SizeGuide = () => {
  return (
    <PageTemplate title="Size Guide">
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-600 mb-8">
          Find your perfect fit with our detailed size guides. Use these measurements to ensure you get the right size.
        </p>

        <Card>
          <CardContent className="p-6">
            <img 
              src="/lovable-uploads/5578ad4b-ffbd-4367-820b-328ec4f67554.png" 
              alt="Size Guide Chart" 
              className="w-full rounded-md"
            />
          </CardContent>
        </Card>

        <div className="mt-12 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">How to Measure</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>Chest (A):</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
              <li><strong>Waist (B):</strong> Measure around your natural waistline, at the narrowest part of your waist.</li>
              <li><strong>Hip (C):</strong> Measure around the fullest part of your hips, keeping the tape horizontal.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Size Guide Tips</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>If you're between sizes, order the larger size for a more comfortable fit.</li>
              <li>All measurements are approximate and may vary slightly between styles.</li>
              <li>For the best fit, compare your measurements to the size chart.</li>
              <li>If you need help, don't hesitate to contact our customer service team.</li>
            </ul>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default SizeGuide;
