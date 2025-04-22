import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../../../store/language';
import { useThemeStore } from '../../../store/theme';
import { Sun, Moon } from 'lucide-react';

const Settings = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">{t('common.settings')}</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6 border border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-medium mb-4">{t('common.theme.title')}</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                !isDarkMode
                  ? 'bg-primary-50 border-primary-500 text-primary-500 dark:bg-primary-900'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <Sun className="w-5 h-5" />
              <span>{t('common.theme.light')}</span>
            </button>
            <button
              onClick={toggleTheme}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-primary-50 border-primary-500 text-primary-500 dark:bg-primary-900'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <Moon className="w-5 h-5" />
              <span>{t('common.theme.dark')}</span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">{t('common.language.title')}</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-lg border ${
                language === 'en'
                  ? 'bg-primary-50 border-primary-500 text-primary-500 dark:bg-primary-900'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {t('common.language.en')}
            </button>
            <button
              onClick={() => setLanguage('ja')}
              className={`px-4 py-2 rounded-lg border ${
                language === 'ja'
                  ? 'bg-primary-50 border-primary-500 text-primary-500 dark:bg-primary-900'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {t('common.language.ja')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;