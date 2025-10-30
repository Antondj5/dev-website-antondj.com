// Theme Context
// Manages theme state and switching

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEMES = {
  macos: 'macos',
  'macos-dark': 'macos-dark',
  matrix: 'matrix',
  dracula: 'dracula',
  default: 'default'
};

const STORAGE_KEY = 'terminal_theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(THEMES.macos);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && THEMES[saved]) {
        setTheme(saved);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }, [theme]);

  const changeTheme = (newTheme) => {
    if (THEMES[newTheme]) {
      setTheme(newTheme);
    }
  };

  const toggleTheme = () => {
    const themeKeys = Object.keys(THEMES);
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(THEMES[themeKeys[nextIndex]]);
  };

  const value = {
    theme,
    themes: THEMES,
    changeTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export default ThemeContext;
