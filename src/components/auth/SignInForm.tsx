
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import PasswordInput from './PasswordInput';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Define form validation schema
const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

interface SignInFormProps {
  onError: (error: string) => void;
  onDebugInfo: (info: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SignInForm = ({ onError, onDebugInfo, isLoading, setIsLoading }: SignInFormProps) => {
  const { signInWithEmail } = useAuthMethods();
  const [authInProgress, setAuthInProgress] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    try {
      setIsLoading(true);
      setAuthInProgress(true);
      onError(''); // Clear any previous errors
      
      // For debugging: log authentication attempt
      const debugInfo = {
        timestamp: new Date().toISOString(),
        method: 'email',
        email: values.email,
        auth_provider: 'supabase',
      };
      onDebugInfo(JSON.stringify(debugInfo));
      
      console.log('Attempting sign in with:', values.email);
      const result = await signInWithEmail(values.email, values.password);
      
      if (!result.success) {
        onError(result.error || 'An error occurred during sign in');
        console.error('Sign in failed:', result.error);
      }
    } catch (error) {
      console.error('Exception during sign in:', error);
      onError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setAuthInProgress(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  {...field} 
                  disabled={isLoading}
                  data-testid="email-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput 
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  disabled={isLoading}
                  data-testid="password-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
          data-testid="sign-in-button"
        >
          {authInProgress ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
