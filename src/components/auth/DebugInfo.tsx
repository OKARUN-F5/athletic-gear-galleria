import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface DebugInfoProps {
  authDebugInfo: string | null;
}

const DebugInfo = ({ authDebugInfo }: DebugInfoProps) => {
  if (!authDebugInfo) return null;
  
  // Parse debug info if it's in JSON format
  let parsedInfo = authDebugInfo;
  try {
    const jsonData = JSON.parse(authDebugInfo);
    parsedInfo = JSON.stringify(jsonData, null, 2);
  } catch (e) {
    // Not JSON, keep as is
  }
  
  return (
    <Alert className="bg-gray-100 border-gray-300">
      <Info className="h-4 w-4 text-gray-600" />
      <AlertTitle className="text-gray-700">Debug Information</AlertTitle>
      <AlertDescription>
        <div className="flex flex-col">
          <pre className="text-xs overflow-auto max-h-48 bg-gray-50 p-2 rounded mt-1 border border-gray-200">
            {parsedInfo}
          </pre>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DebugInfo;
