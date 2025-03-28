
import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface DefaultCredentialsProps {
  show: boolean;
  onUseCredentials: () => void;
}

const DefaultCredentials = ({ show, onUseCredentials }: DefaultCredentialsProps) => {
  if (!show) return null;
  
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-500" />
      <AlertTitle className="text-blue-700">Development Environment</AlertTitle>
      <AlertDescription className="text-blue-700">
        <div className="flex flex-col">
          <p className="mb-2">For testing purposes, you can use the default admin account:</p>
          <div className="bg-white p-3 rounded border border-blue-100 mb-2">
            <p className="font-mono text-sm mb-1">Email: <span className="font-bold">admin@example.com</span></p>
            <p className="font-mono text-sm">Password: <span className="font-bold">Admin123!@#</span></p>
          </div>
          <Button 
            variant="outline" 
            onClick={onUseCredentials} 
            className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-800 self-start"
          >
            Use these credentials
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DefaultCredentials;
