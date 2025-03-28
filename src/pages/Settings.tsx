
import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import PageTemplate from './PageTemplate';
import { useRegion } from '@/contexts/RegionContext';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const { region, setRegion, country, setCountry, getCurrencySymbol, getCountryOptions } = useRegion();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const countryOptions = getCountryOptions();

  return (
    <PageTemplate title="Settings">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Region Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Region Settings</h2>
          </div>
          <p className="text-gray-600">
            Choose your region to get personalized content and pricing ({getCurrencySymbol()})
          </p>
          <RadioGroup 
            value={region} 
            onValueChange={(value: 'Africa' | 'UK_EU' | 'US_CAD') => setRegion(value)}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Africa" id="Africa" />
                <Label htmlFor="Africa">Africa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="UK_EU" id="UK_EU" />
                <Label htmlFor="UK_EU">UK + Europe</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="US_CAD" id="US_CAD" />
                <Label htmlFor="US_CAD">US + Canada</Label>
              </div>
            </div>
          </RadioGroup>

          {/* Country selector for all regions */}
          <div className="mt-4">
            <Label htmlFor="country-select">Select Country</Label>
            <Select 
              value={country || ''} 
              onValueChange={(value) => setCountry(value as any)}
            >
              <SelectTrigger id="country-select" className="w-full mt-2">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {countryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              Current currency: {getCurrencySymbol()}
            </p>
          </div>
        </div>

        <Separator />

        {/* Notification Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive updates about your orders</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Order Updates</Label>
                <p className="text-sm text-gray-600">Get notified about order status changes</p>
              </div>
              <Switch
                checked={orderUpdates}
                onCheckedChange={setOrderUpdates}
              />
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Settings;
