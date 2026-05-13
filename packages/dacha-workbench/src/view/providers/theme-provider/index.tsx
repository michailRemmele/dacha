import { useState, useEffect } from 'react';
import type { FC } from 'react';

import { persistentStorage } from '../../../persistent-storage';

import { ConfigProvider } from './config-provider';
import { ThemeTokenProvider } from './theme-token-provider';
import { ThemeContext } from './contexts';
import type { ThemeMode, ThemePreference } from './types';

const DARK_THEME_QUERY = '(prefers-color-scheme: dark)';

const getSystemThemeMode = (): ThemeMode =>
  window.matchMedia(DARK_THEME_QUERY).matches ? 'dark' : 'light';

const getThemeMode = (preference: ThemePreference): ThemeMode =>
  preference === 'system' ? getSystemThemeMode() : preference;

interface ThemeProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [preference, setPreference] = useState<ThemePreference>(() =>
    persistentStorage.get('themePreference', 'system'),
  );
  const [mode, setMode] = useState<ThemeMode>(() => getThemeMode(preference));

  useEffect(() => {
    window.electron.updateMenuState('themePreference', preference);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('editor-theme_dark', mode === 'dark');
  }, [mode]);

  useEffect(() => {
    setMode(getThemeMode(preference));
  }, [preference]);

  useEffect(() => {
    const themeQuery = window.matchMedia(DARK_THEME_QUERY);

    const handleSystemThemeChange = (): void => {
      setMode((currentMode) =>
        preference === 'system' ? getSystemThemeMode() : currentMode,
      );
    };

    themeQuery.addEventListener('change', handleSystemThemeChange);

    return (): void => {
      themeQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [preference]);

  useEffect(() => {
    const handleSwitchTheme = (themePreference: ThemePreference): void => {
      setPreference(themePreference);
      persistentStorage.set('themePreference', themePreference);
    };

    const unsubscribe = window.electron.onSwitchTheme(handleSwitchTheme);

    return (): void => unsubscribe();
  }, []);

  return (
    <ThemeContext.Provider value={mode}>
      <ConfigProvider>
        <ThemeTokenProvider>{children}</ThemeTokenProvider>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
