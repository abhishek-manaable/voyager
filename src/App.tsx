import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import PrivateRoute from './components/auth/PrivateRoute';
import { useThemeStore } from './store/theme';
import { useLanguageStore } from './store/language';
import { useTranslation } from 'react-i18next';
import { useContractStore } from './store/contracts';
import { useTargetStore } from './store/targets';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isDarkMode } = useThemeStore();
  const { language } = useLanguageStore();
  const { i18n } = useTranslation();
  const { user, loading, error } = useAuth();
  const { initialize: initializeContracts } = useContractStore();
  const { initialize: initializeTargets } = useTargetStore();

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Apply language
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // Initialize data when user is authenticated
  useEffect(() => {
    let unsubscribeContracts: (() => void) | undefined;
    let unsubscribeTargets: (() => void) | undefined;

    if (user) {
      unsubscribeContracts = initializeContracts();
      unsubscribeTargets = initializeTargets();
    }

    return () => {
      unsubscribeContracts?.();
      unsubscribeTargets?.();
    };
  }, [user, initializeContracts, initializeTargets]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;