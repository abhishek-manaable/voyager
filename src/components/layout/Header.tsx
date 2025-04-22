import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, LogOut, Rocket } from 'lucide-react';
import { useThemeStore } from '../../store/theme';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { signOut, user } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 right-0 left-16 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-primary-500">
            <Rocket className="w-6 h-6" />
            <span className="ml-2 text-lg font-medium">Voyager</span>
          </div>
          <div className="text-base font-medium text-primary-500">
            EDUCATION FOR EVERYONE
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || ''}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.displayName || user?.email}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={isDarkMode ? t('common.theme.light') : t('common.theme.dark')}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={signOut}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;