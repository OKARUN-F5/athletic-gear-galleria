
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PasswordInput from './PasswordInput';
import { passwordRegex } from '@/utils/passwordValidation';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .refine(value => passwordRegex.lowercase.test(value), {
      message: 'Password must contain at least one lowercase letter',
    })
    .refine(value => passwordRegex.uppercase.test(value), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine(value => passwordRegex.number.test(value), {
      message: 'Password must contain at least one number',
    })
    .refine(value => passwordRegex.special.test(value), {
      message: 'Password must contain at least one special character',
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

interface SignUpFormProps {
  onError: (error: string) => void;
}

const SignUpForm = ({ onError }: SignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUpWithEmail } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      console.log('Attempting to sign up with:', data.email);
      const result = await signUpWithEmail(data.email, data.password, data.fullName);
      
      if (result.success) {
        toast({
          title: "Sign up successful",
          description: "Welcome to the platform!",
        });
        navigate('/');
      } else if (result.error) {
        console.error('Sign up error:', result.error);
        onError(result.error);
      }
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      onError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Input placeholder="name@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <PasswordInput 
              field={field} 
              label="Password" 
              showRequirements={true}
              onPasswordChange={setPasswordValue}
            />
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <PasswordInput 
              field={field} 
              label="Confirm Password" 
            />
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Create Account
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
