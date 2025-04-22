import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Rocket } from 'lucide-react';

const Login: React.FC = () => {
  const { signInWithGoogle, user, authUser, error: authError, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle successful authentication
  useEffect(() => {
    if (user && authUser && !authLoading) {
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
      sessionStorage.removeItem('redirectUrl');
      navigate(redirectUrl, { replace: true });
    }
  }, [user, authUser, authLoading, navigate, location]);

  useEffect(() => {
    if (authError) {
      setError(authError);
      setIsLoading(false);
    }
  }, [authError]);

  const handleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        setError('Only @manaable.com accounts are allowed');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('Login was cancelled. Please try again.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
      setIsLoading(false);
    }
  };

  // ローディング状態の統合
  const showLoading = authLoading || isLoading;

  if (showLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Signing in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center">
          <Rocket className="w-8 h-8 text-primary-500" />
          <h1 className="ml-2 text-3xl font-bold text-primary-500">Voyager</h1>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Use your @manaable.com Google account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={showLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              showLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {showLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;