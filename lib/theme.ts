export type ThemeMode = 'light' | 'dark';

export type AppTheme = {
  mode: ThemeMode;
  colors: {
    primary: string;
    primaryDark: string;
    accent: string;
    accentLight: string;
    background: string;
    surface: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textOnPrimary: string;
    success: string;
    successDark: string;
    error: string;
    warning: string;
    surfacePressed: string;
    tabActive: string;
    tabInactive: string;
  };
};

export const THEME_STORAGE_KEY = 'optcar.theme.mode';

const lightColors: AppTheme['colors'] = {
  primary: '#355CDE',
  primaryDark: '#2A49B1',
  accent: '#FF8A3D',
  accentLight: '#FFB172',
  background: '#F4F6FA',
  surface: '#FFFFFF',
  border: '#DDE3EE',
  textPrimary: '#121826',
  textSecondary: '#5D6778',
  textOnPrimary: '#FFFFFF',
  success: '#1FA971',
  successDark: '#17885A',
  error: '#D64545',
  warning: '#D98A2B',
  surfacePressed: '#E9EDF5',
  tabActive: '#355CDE',
  tabInactive: '#7A8599',
};

const darkColors: AppTheme['colors'] = {
  primary: '#7EA2FF',
  primaryDark: '#5E84E8',
  accent: '#FF9E58',
  accentLight: '#FFC08E',
  background: '#0B1020',
  surface: '#151B2D',
  border: '#28314A',
  textPrimary: '#F5F7FF',
  textSecondary: '#A2AECB',
  textOnPrimary: '#FFFFFF',
  success: '#34D399',
  successDark: '#10B981',
  error: '#FF6B6B',
  warning: '#F2A94A',
  surfacePressed: '#202944',
  tabActive: '#8FB0FF',
  tabInactive: '#7F8BA8',
};

export const themes: Record<ThemeMode, AppTheme> = {
  light: { mode: 'light', colors: lightColors },
  dark: { mode: 'dark', colors: darkColors },
};
