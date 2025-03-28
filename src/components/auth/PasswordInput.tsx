import { useState } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import PasswordRequirements from './PasswordRequirements';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

interface PasswordInputProps {
  value?: string;
  onChange?: (...event: any[]) => void;
  onBlur?: () => void;
  name?: string;
  ref?: React.Ref<HTMLInputElement>;
  field?: ControllerRenderProps<FieldValues, string>;
  label?: string;
  placeholder?: string;
  showRequirements?: boolean;
  onPasswordChange?: (value: string) => void;
  disabled?: boolean;
  'data-testid'?: string;
}

const PasswordInput = ({ 
  value,
  onChange,
  onBlur,
  name,
  ref,
  field,
  label = "Password",
  placeholder = "••••••••", 
  showRequirements = false,
  onPasswordChange,
  disabled,
  'data-testid': dataTestId
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputValue = field?.value ?? value;
  const inputName = field?.name ?? name;
  const inputRef = field?.ref ?? ref;
  const inputDisabled = disabled;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field) {
      field.onChange(e);
    } 
    else if (onChange) {
      onChange(e);
    }
    
    if (onPasswordChange) {
      onPasswordChange(e.target.value);
    }
  };

  const handleBlur = () => {
    if (field) {
      field.onBlur();
    } else if (onBlur) {
      onBlur();
    }
  };

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div className="relative">
          <Input 
            placeholder={placeholder} 
            type={showPassword ? "text" : "password"} 
            name={inputName}
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            ref={inputRef as React.RefObject<HTMLInputElement>}
            disabled={inputDisabled}
            data-testid={dataTestId}
          />
          <button 
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
            disabled={inputDisabled}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </FormControl>
      <FormMessage />
      {showRequirements && <PasswordRequirements password={inputValue || ''} />}
    </FormItem>
  );
};

export default PasswordInput;
