
import PageTemplate from './PageTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CreditCard, Wallet, Banknote } from 'lucide-react';

const PaymentOptions = () => {
  return (
    <PageTemplate title="Payment Options">
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Available Payment Methods</h2>
          <p className="text-gray-600 mb-8">
            We accept a variety of payment methods to make your shopping experience as convenient as possible.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Credit & Debit Cards
                </CardTitle>
                <CardDescription>All major credit and debit cards accepted</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Visa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Mastercard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>American Express</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Discover</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Digital Wallets
                </CardTitle>
                <CardDescription>Fast and secure checkout with digital wallets</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Apple Pay</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Google Pay</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>PayPal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Shop Pay</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Payment Processing</h2>
          <p className="text-gray-600 mb-4">
            Our payment processing is handled by Stripe, one of the most secure payment processors in the industry. All transactions are encrypted and your payment information is never stored on our servers.
          </p>
          <p className="text-gray-600">
            When ready to implement payment processing, we'll use Stripe's secure checkout system to handle all transactions safely and efficiently.
          </p>
        </section>
        
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Coming Soon: Additional Payment Options</h2>
          <div className="flex items-center gap-3 mb-4">
            <Banknote className="h-5 w-5 text-gray-600" />
            <span>Buy Now, Pay Later options through Affirm, Klarna, and Afterpay</span>
          </div>
          <p className="text-gray-600">
            We're constantly working to improve your shopping experience. Stay tuned for more payment options!
          </p>
        </section>
      </div>
    </PageTemplate>
  );
};

export default PaymentOptions;
