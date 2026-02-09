import { useRouter } from 'next/router';
import { AuthForm } from '@/components/AuthForm';
import { isAuthenticated } from '@/lib/auth';
import { useEffect } from 'react';

export default function Register() {
  const router = useRouter();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleSuccess = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-300 mt-2">Join TaskFlow to get started</p>
        </div>
        
        <AuthForm mode="register" onSuccess={handleSuccess} />
        
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}