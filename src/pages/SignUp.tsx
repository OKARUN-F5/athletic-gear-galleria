
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import GoogleSignUpButton from '@/components/auth/GoogleSignUpButton';
import SignUpForm from '@/components/auth/SignUpForm';

const SignUp = () => {
  const [signUpError, setSignUpError] = useState<string | null>(null);

  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-gray-500">Enter your information to create your account</p>
        </div>

        {signUpError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{signUpError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <GoogleSignUpButton />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <SignUpForm onError={setSignUpError} />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
