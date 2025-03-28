
import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Updated region types to match the new structure
type AfricanCountry = 'Nigeria' | 'South Africa' | 'Ghana';
type EuropeanCountry = 'UK' | 'Germany' | 'France';
type NorthAmericanCountry = 'US' | 'Canada';

type Region = 'Africa' | 'UK_EU' | 'US_CAD';
type Country = AfricanCountry | EuropeanCountry | NorthAmericanCountry | null;

type Currency = '₦' | 'R' | '₵' | '€' | '£' | '$' | 'C$';

type RegionContextType = {
  region: Region;
  setRegion: (region: Region) => void;
  country: Country;
  setCountry: (country: Country) => void;
  getCurrencySymbol: () => Currency;
  getCountryOptions: () => { value: string; label: string }[];
  locationDetected: boolean;
};

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const RegionProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize region and country from localStorage if available, defaulting to Nigeria
  const [region, setRegion] = useState<Region>(() => {
    const saved = localStorage.getItem('region');
    return (saved as Region) || 'Africa';
  });
  
  const [country, setCountry] = useState<Country>(() => {
    const saved = localStorage.getItem('country');
    return (saved as Country) || 'Nigeria';
  });
  
  const [locationDetected, setLocationDetected] = useState(false);
  const { toast } = useToast();

  // Detect user's location on first load
  useEffect(() => {
    const detectLocation = async () => {
      // Only attempt location detection if we haven't already detected it in this session
      if (localStorage.getItem('locationDetected') === 'true') {
        return;
      }

      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Use a reverse geocoding API to get country from coordinates
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              
              if (data.address && data.address.country) {
                let newRegion: Region = region;
                let newCountry: Country = country;
                
                // Map country name to our region and country types
                const countryName = data.address.country;
                
                if (countryName === 'Nigeria' || countryName === 'Ghana' || countryName === 'South Africa') {
                  newRegion = 'Africa';
                  newCountry = countryName as AfricanCountry;
                } else if (countryName === 'United Kingdom' || countryName === 'Germany' || countryName === 'France') {
                  newRegion = 'UK_EU';
                  if (countryName === 'United Kingdom') newCountry = 'UK';
                  else newCountry = countryName as EuropeanCountry;
                } else if (countryName === 'United States' || countryName === 'Canada') {
                  newRegion = 'US_CAD';
                  if (countryName === 'United States') newCountry = 'US';
                  else newCountry = countryName as NorthAmericanCountry;
                }
                
                // Only show the prompt if the detected location is different from current
                if (newRegion !== region || newCountry !== country) {
                  setLocationDetected(true);
                  
                  toast({
                    title: "Location Detected",
                    description: `We detected you're in ${countryName}. Would you like to switch to this region?`,
                    action: (
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => {
                            setRegion(newRegion);
                            setCountry(newCountry);
                            setLocationDetected(false);
                            localStorage.setItem('locationDetected', 'true');
                          }}
                          className="bg-primary text-white px-3 py-1 rounded-md text-sm"
                        >
                          Yes, Switch
                        </button>
                        <button 
                          onClick={() => {
                            setLocationDetected(false);
                            localStorage.setItem('locationDetected', 'true');
                          }}
                          className="bg-gray-200 px-3 py-1 rounded-md text-sm"
                        >
                          No, Keep Current
                        </button>
                      </div>
                    ),
                    duration: 10000,
                  });
                }
              }
            } catch (error) {
              console.error('Error fetching location data:', error);
            }
          }, (error) => {
            console.error('Geolocation error:', error);
          });
        }
      } catch (error) {
        console.error('Error detecting location:', error);
      }
    };

    detectLocation();
  }, []);

  // Get country options based on selected region
  const getCountryOptions = () => {
    switch (region) {
      case 'Africa':
        return [
          { value: 'Nigeria', label: 'Nigeria' },
          { value: 'South Africa', label: 'South Africa' },
          { value: 'Ghana', label: 'Ghana' }
        ];
      case 'UK_EU':
        return [
          { value: 'UK', label: 'United Kingdom' },
          { value: 'Germany', label: 'Germany' },
          { value: 'France', label: 'France' }
        ];
      case 'US_CAD':
        return [
          { value: 'US', label: 'United States' },
          { value: 'Canada', label: 'Canada' }
        ];
      default:
        return [];
    }
  };

  // Get the currency symbol based on region and country
  const getCurrencySymbol = (): Currency => {
    if (region === 'Africa') {
      switch (country) {
        case 'Nigeria':
          return '₦';
        case 'South Africa':
          return 'R';
        case 'Ghana':
          return '₵';
        default:
          return '₦'; // Default to Naira
      }
    } else if (region === 'UK_EU') {
      switch (country) {
        case 'UK':
          return '£';
        default:
          return '€'; // Default to Euro for EU countries
      }
    } else { // US_CAD
      switch (country) {
        case 'Canada':
          return 'C$';
        default:
          return '$'; // Default to USD
      }
    }
  };

  // Update country when region changes
  useEffect(() => {
    // Set default country for each region
    if (region === 'Africa' && (!country || !['Nigeria', 'South Africa', 'Ghana'].includes(country as AfricanCountry))) {
      setCountry('Nigeria');
    } else if (region === 'UK_EU' && (!country || !['UK', 'Germany', 'France'].includes(country as EuropeanCountry))) {
      setCountry('UK');
    } else if (region === 'US_CAD' && (!country || !['US', 'Canada'].includes(country as NorthAmericanCountry))) {
      setCountry('US');
    }
  }, [region]);

  // Save region and country to localStorage when they change
  useEffect(() => {
    localStorage.setItem('region', region);
    if (country) {
      localStorage.setItem('country', country);
    }
    
    toast({
      title: "Region Updated",
      description: `Your region has been updated to ${region}${country ? ` (${country})` : ''}`,
    });
  }, [region, country]);

  return (
    <RegionContext.Provider value={{ 
      region, 
      setRegion, 
      country, 
      setCountry, 
      getCurrencySymbol,
      getCountryOptions,
      locationDetected
    }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};
