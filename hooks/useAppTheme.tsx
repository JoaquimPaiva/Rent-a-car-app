import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { THEME_STORAGE_KEY, themes, type AppTheme, type ThemeMode } from '../lib/theme';

type AppThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
  toggleTheme: () => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  loading: boolean;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
          setMode(stored);
        }
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const setThemeMode = async (nextMode: ThemeMode) => {
    setMode(nextMode);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
  };

  const toggleTheme = async () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    await setThemeMode(next);
  };

  const value = useMemo<AppThemeContextValue>(
    () => ({ theme: themes[mode], mode, toggleTheme, setThemeMode, loading }),
    [loading, mode],
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
};

export const useAppTheme = (): AppThemeContextValue => {
  const context = useContext(AppThemeContext);
  if (!context) throw new Error('useAppTheme must be used inside ThemeProvider');
  return context;
};
