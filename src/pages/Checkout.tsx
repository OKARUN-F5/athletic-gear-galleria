
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { useRegion } from '@/contexts/RegionContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useShipping } from '@/hooks/useShipping';
import { Loader2, CreditCard, Check, Truck } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  addressLine1: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: 'City must be at least 2 characters' }),
  state: z.string().min(2, { message: 'State must be at least 2 characters' }),
  zipCode: z.string().min(4, { message: 'Zip code must be at least 4 characters' }),
  country: z.string().min(2, { message: 'Country must be at least 2 characters' }),
  shippingMethod: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Mock cart data - in a real app this would come from a cart context/store
const mockCart = [
  { id: '1', name: 'Basketball Jersey', price: 79.99, quantity: 1 },
  { id: '2', name: 'Sports Shorts', price: 39.99, quantity: 2 },
];

const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
];

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [selectedShippingRate, setSelectedShippingRate] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCurrencySymbol } = useRegion();
  const { user } = useAuth();
  const currencySymbol = getCurrencySymbol();

  // Calculate subtotal from cart
  const subtotal = mockCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Get shipping rates based on selected country and order total
  const { shippingRates, loading: loadingShipping } = useShipping(selectedCountry, subtotal);
  
  // Default shipping price (will be updated when user selects a shipping method)
  const [shippingCost, setShippingCost] = useState(0);
  
  // Calculate total with shipping
  const total = subtotal + shippingCost;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: user?.email || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      shippingMethod: '',
      notes: '',
    },
  });

  // Handle country selection
  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    form.setValue('country', value);
    // Reset shipping method when country changes
    setSelectedShippingRate(null);
    form.setValue('shippingMethod', '');
    setShippingCost(0);
  };

  // Handle shipping method selection
  const handleShippingMethodChange = (value: string) => {
    setSelectedShippingRate(value);
    form.setValue('shippingMethod', value);
    
    // Update shipping cost
    const selectedRate = shippingRates.find(rate => rate.id === value);
    if (selectedRate) {
      setShippingCost(selectedRate.price);
    }
  };

  // Process payment through Supabase Edge Function
  const processPayment = async (paymentData: FormData) => {
    try {
      const selectedRate = shippingRates.find(rate => rate.id === selectedShippingRate);
      
      const response = await supabase.functions.invoke('process-payment', {
        body: {
          paymentMethod: 'card',
          amount: total,
          currency: 'usd',
          description: 'Order from Plug Jerseys',
          items: mockCart,
          customerEmail: paymentData.email,
          shipping: {
            name: paymentData.fullName,
            address: {
              line1: paymentData.addressLine1,
              city: paymentData.city,
              state: paymentData.state,
              postal_code: paymentData.zipCode,
              country: paymentData.country,
            }
          },
          shippingRateId: selectedShippingRate
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Payment failed');
      }

      // If Stripe returns a checkout URL, redirect the user
      if (response.data.url) {
        window.location.href = response.data.url;
        return null; // We're redirecting, so no need to return data
      }

      return response.data;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  };

  // Create order in database
  const createOrder = async (paymentData: FormData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Create order in database using the RPC function
      const { data: order, error } = await supabase.rpc('create_order_with_items', {
        p_user_id: user.id,
        p_total: parseFloat(total.toString()),
        p_items: mockCart
      });

      if (error) {
        throw error;
      }

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to complete your order',
        variant: 'destructive',
      });
      navigate('/sign-in');
      return;
    }

    if (!selectedShippingRate) {
      toast({
        title: 'Shipping Method Required',
        description: 'Please select a shipping method to continue',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Process payment
      const paymentResult = await processPayment(data);
      
      // If we got redirected to Stripe, we won't get here
      if (paymentResult) {
        // Create order in database
        await createOrder(data);
        
        // Show success state
        setIsSuccess(true);
        
        toast({
          title: 'Order Completed',
          description: 'Your payment was successful and your order is being processed',
        });
        
        // Redirect to order confirmation after a delay
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="bg-green-50 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-green-700 mb-6">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <p className="text-green-600 mb-8">
            You will be redirected to your orders page shortly.
          </p>
          <Button onClick={() => navigate('/orders')}>View My Orders</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Apartment, suite, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP / Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select 
                          onValueChange={handleCountryChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COUNTRY_OPTIONS.map((country) => (
                              <SelectItem key={country.value} value={country.value}>
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Shipping Method */}
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                
                {loadingShipping ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <p>Loading shipping options...</p>
                  </div>
                ) : shippingRates.length === 0 ? (
                  <div className="text-center p-4 border border-dashed rounded-md">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">No shipping methods available for the selected country.</p>
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="shippingMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={handleShippingMethodChange}
                            value={selectedShippingRate || ''}
                            className="space-y-3"
                          >
                            {shippingRates.map((rate) => (
                              <div
                                key={rate.id}
                                className={`flex items-center justify-between border rounded-lg p-4 ${
                                  selectedShippingRate === rate.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <RadioGroupItem value={rate.id} id={rate.id} />
                                  <div>
                                    <label
                                      htmlFor={rate.id}
                                      className="text-sm font-medium cursor-pointer"
                                    >
                                      {rate.name}
                                    </label>
                                    {rate.min_delivery_days && rate.max_delivery_days && (
                                      <p className="text-sm text-gray-500">
                                        {rate.min_delivery_days === rate.max_delivery_days
                                          ? `${rate.min_delivery_days} days`
                                          : `${rate.min_delivery_days}-${rate.max_delivery_days} days`}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="font-medium">
                                  {currencySymbol}{rate.price.toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              {/* Additional Information */}
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Special delivery instructions or other notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Mobile Summary (visible on small screens) */}
              <div className="lg:hidden bg-white p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {mockCart.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Shipping</p>
                    <p className="font-medium">
                      {shippingCost > 0 
                        ? `${currencySymbol}${shippingCost.toFixed(2)}` 
                        : 'Select shipping method'}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <p className="font-bold">Total</p>
                    <p className="font-bold">{currencySymbol}{total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold" 
                disabled={isLoading || loadingShipping}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Complete Order</>
                )}
              </Button>
            </form>
          </Form>
        </div>
        
        {/* Order Summary (visible on large screens) */}
        <div className="hidden lg:block">
          <div className="bg-white p-6 rounded-lg border shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {mockCart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p className="font-medium">
                  {shippingCost > 0 
                    ? `${currencySymbol}${shippingCost.toFixed(2)}` 
                    : 'Select shipping method'}
                </p>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <p className="font-bold">Total</p>
                <p className="font-bold">{currencySymbol}{total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
