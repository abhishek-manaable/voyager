import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageStore {
  language: 'en' | 'ja';
  setLanguage: (lang: 'en' | 'ja') => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'language-storage',
    }
  )
);