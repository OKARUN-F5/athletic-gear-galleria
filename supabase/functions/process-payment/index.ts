
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  paymentMethod: string;
  amount: number;
  currency: string;
  description: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  customerEmail?: string;
  shipping?: {
    name: string;
    address: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    }
  };
  shippingRateId?: string;
}

interface PaymentResponse {
  success: boolean;
  id: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  created: string;
  receipt_url?: string;
  customer_email?: string;
  payment_method?: string;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const { 
      paymentMethod, 
      amount, 
      currency, 
      description, 
      items, 
      customerEmail, 
      shipping,
      shippingRateId
    } = await req.json() as PaymentRequest

    console.log(`Processing payment of ${amount} ${currency} for ${description}`)
    console.log(`Items:`, JSON.stringify(items))
    
    // Check if we're using a real Stripe integration
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    
    if (STRIPE_SECRET_KEY) {
      // Initialize Stripe
      const stripe = new Stripe(STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16',
      });

      const lineItems = items.map(item => ({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Stripe requires amount in cents
        },
        quantity: item.quantity,
      }));

      // Create a Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.get('origin') || 'http://localhost:5173'}/orders?success=true`,
        cancel_url: `${req.headers.get('origin') || 'http://localhost:5173'}/checkout?canceled=true`,
        shipping_address_collection: shipping ? {
          allowed_countries: ['US', 'CA', 'GB', 'AU'], // Add countries you want to support
        } : undefined,
        shipping_options: shippingRateId ? [{
          shipping_rate: shippingRateId,
        }] : undefined,
        customer_email: customerEmail,
      });

      // Return the checkout session URL
      return new Response(
        JSON.stringify({
          success: true,
          id: session.id,
          url: session.url,
          amount: amount,
          currency: currency,
          description: description,
          status: 'pending',
          created: new Date().toISOString(),
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      )
    } else {
      // Simulate a successful payment for development if no Stripe key
      console.log('No STRIPE_SECRET_KEY found, simulating payment success')
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simulate a successful payment
      const paymentResult: PaymentResponse = {
        success: true,
        id: `pay_${Date.now()}`,
        amount,
        currency,
        description,
        status: 'succeeded',
        created: new Date().toISOString(),
        receipt_url: 'https://example.com/receipt', 
        customer_email: customerEmail,
        payment_method: 'card'
      }

      return new Response(
        JSON.stringify(paymentResult),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      )
    }
  } catch (error) {
    console.error('Error processing payment:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        status: 'failed' 
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})
