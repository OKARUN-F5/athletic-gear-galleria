
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import SignInForm from '@/components/auth/SignInForm';
import DefaultCredentials from '@/components/auth/DefaultCredentials';
import SignInError from '@/components/auth/SignInError';
import DebugInfo from '@/components/auth/DebugInfo';

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDefaultCredentials, setShowDefaultCredentials] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authDebugInfo, setAuthDebugInfo] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for the existence of admin users
  useEffect(() => {
    const checkForAdmins = async () => {
      try {
        // Always show default credentials for this demo
        setShowDefaultCredentials(true);
        
        // Try to get current session
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session ? 'Active' : 'None');
        
        // Check if we can access the users table
        const { data: users, error: usersError } = await supabase.from('users').select('*').limit(5);
        if (usersError) {
          console.error('Error fetching users:', usersError);
        } else {
          console.log('Found users:', users?.length || 0);
        }
      } catch (error) {
        console.error('Error in admin check:', error);
      }
    };

    checkForAdmins();
  }, []);

  const useDefaultCredentials = () => {
    // This function will be passed to the DefaultCredentials component
    // to fill in the form with the default admin credentials
    const emailField = document.querySelector('input[type="email"]') as HTMLInputElement;
    const passwordField = document.querySelector('input[type="password"]') as HTMLInputElement;
    
    if (emailField) emailField.value = 'admin@example.com';
    if (passwordField) passwordField.value = 'Admin123!@#';
    
    // Update the form state programmatically
    const formEvent = new Event('input', { bubbles: true });
    if (emailField) {
      emailField.dispatchEvent(formEvent);
    }
    if (passwordField) {
      passwordField.dispatchEvent(formEvent);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-500">Enter your credentials to access your account</p>
        </div>

        <DefaultCredentials 
          show={showDefaultCredentials} 
          onUseCredentials={useDefaultCredentials} 
        />

        <SignInError error={loginError} />
        
        <DebugInfo authDebugInfo={authDebugInfo} />

        <div className="space-y-4">
          <GoogleSignInButton />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <SignInForm 
            onError={setLoginError}
            onDebugInfo={setAuthDebugInfo}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
