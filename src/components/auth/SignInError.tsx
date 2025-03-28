
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SignInErrorProps {
  error: string | null;
}

const SignInError = ({ error }: SignInErrorProps) => {
  if (!error) return null;
  
  // Map common error messages to more user-friendly ones
  const getFriendlyErrorMessage = (errorMessage: string) => {
    if (errorMessage.includes('Invalid login credentials')) {
      return 'The email or password you entered is incorrect. Please try again.';
    }
    
    if (errorMessage.includes('Email not confirmed')) {
      return 'Please verify your email address before signing in. Check your inbox for a verification email.';
    }
    
    if (errorMessage.includes('Email link is invalid or has expired')) {
      return 'The email verification link is invalid or has expired. Please request a new one.';
    }
    
    if (errorMessage.includes('rate limit')) {
      return 'Too many sign-in attempts. Please try again later.';
    }
    
    if (errorMessage.includes('requested path is invalid')) {
      return 'Authentication redirect path is invalid. Please contact the administrator.';
    }
    
    return errorMessage;
  };
  
  const friendlyMessage = getFriendlyErrorMessage(error);
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Sign In Failed</AlertTitle>
      <AlertDescription>
        {friendlyMessage}
      </AlertDescription>
    </Alert>
  );
};

export default SignInError;
