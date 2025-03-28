
import { CheckCircle2, XCircle } from 'lucide-react';
import { passwordRegex, checkPasswordRequirement } from '@/utils/passwordValidation';

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  if (!password) return null;
  
  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs font-medium">Password must contain:</p>
      <ul className="space-y-1 text-xs">
        <li className="flex items-center space-x-2">
          {checkPasswordRequirement(passwordRegex.lowercase, password) ? 
            <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
            <XCircle className="h-3 w-3 text-red-500" />
          }
          <span>At least one lowercase letter</span>
        </li>
        <li className="flex items-center space-x-2">
          {checkPasswordRequirement(passwordRegex.uppercase, password) ? 
            <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
            <XCircle className="h-3 w-3 text-red-500" />
          }
          <span>At least one uppercase letter</span>
        </li>
        <li className="flex items-center space-x-2">
          {checkPasswordRequirement(passwordRegex.number, password) ? 
            <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
            <XCircle className="h-3 w-3 text-red-500" />
          }
          <span>At least one number</span>
        </li>
        <li className="flex items-center space-x-2">
          {checkPasswordRequirement(passwordRegex.special, password) ? 
            <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
            <XCircle className="h-3 w-3 text-red-500" />
          }
          <span>At least one special character (!@#$%^&*)</span>
        </li>
        <li className="flex items-center space-x-2">
          {password.length >= 8 ? 
            <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
            <XCircle className="h-3 w-3 text-red-500" />
          }
          <span>Minimum 8 characters</span>
        </li>
      </ul>
    </div>
  );
};

export default PasswordRequirements;
