
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.4.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { country_code, order_total } = await req.json();

    if (!country_code) {
      return new Response(
        JSON.stringify({ error: 'Country code is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log(`Calculating shipping for country: ${country_code}, order total: ${order_total}`);

    // Find the shipping options for the country
    const { data: shippingOptions, error } = await supabase
      .from('shipping_options')
      .select('*')
      .eq('region', country_code);

    if (error) {
      throw error;
    }

    if (!shippingOptions || shippingOptions.length === 0) {
      // If no specific rates for country, fallback to generic 'INTL' rates
      const { data: intlShippingOptions, error: intlError } = await supabase
        .from('shipping_options')
        .select('*')
        .eq('region', 'INTL');

      if (intlError) {
        throw intlError;
      }

      if (!intlShippingOptions || intlShippingOptions.length === 0) {
        return new Response(
          JSON.stringify([]),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const results = intlShippingOptions.map(option => ({
        id: option.id,
        name: option.name,
        price: option.base_cost,
        min_delivery_days: option.delivery_time_min,
        max_delivery_days: option.delivery_time_max
      }));

      return new Response(
        JSON.stringify(results),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Format response for country-specific shipping options
    const results = shippingOptions.map(option => ({
      id: option.id,
      name: option.name,
      price: option.base_cost,
      min_delivery_days: option.delivery_time_min,
      max_delivery_days: option.delivery_time_max
    }));

    return new Response(
      JSON.stringify(results),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error calculating shipping:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})
