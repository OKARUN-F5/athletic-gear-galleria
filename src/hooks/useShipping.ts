
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ShippingZone {
  id: string;
  name: string;
  country_codes: string[];
}

interface ShippingRate {
  id: string;
  zone_id: string;
  name: string;
  price: number;
  min_delivery_days: number | null;
  max_delivery_days: number | null;
}

export const useShipping = (countryCode: string, orderTotal: number) => {
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchShippingRates = async () => {
      try {
        setLoading(true);
        
        // Use the calculate_shipping function to get available shipping rates
        const { data, error } = await supabase
          .rpc('calculate_shipping', {
            p_country_code: countryCode,
            p_order_total: orderTotal
          });
        
        if (error) {
          throw error;
        }
        
        // Transform the data to match our ShippingRate interface
        const rates: ShippingRate[] = data.map((item: any) => ({
          id: item.rate_id,
          zone_id: '', // We don't get this from the function but it's not needed
          name: item.rate_name,
          price: item.rate_price,
          min_delivery_days: item.min_days,
          max_delivery_days: item.max_days
        }));
        
        setShippingRates(rates);
      } catch (err) {
        console.error('Error fetching shipping rates:', err);
        setError(err.message);
        toast({
          title: 'Error',
          description: 'Failed to load shipping options. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (countryCode) {
      fetchShippingRates();
    } else {
      setShippingRates([]);
      setLoading(false);
    }
  }, [countryCode, orderTotal, toast]);

  return {
    shippingRates,
    loading,
    error
  };
};
