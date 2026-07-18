// src/contexts/ThemeContext.tsx

import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { ChakraProvider, extendTheme, ThemeOverride } from "@chakra-ui/react";
import { reyvateilThemes } from "../reyvateilThemes";
import { omniaTheme } from '../theme';

interface ThemeContextProps {
  currentTheme: ThemeOverride;
  setReyvateilTheme: (reyvateilId: string) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  currentTheme: omniaTheme,
  setReyvateilTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [reyvateilThemeId, setReyvateilThemeId] = useState<string>(() => localStorage.getItem('omnia-theme') || '');

  const currentTheme = useMemo(() => {
    const selected = reyvateilThemes[reyvateilThemeId];
    if (!selected) return omniaTheme;
    // Reyvateil themes were created as complete Chakra themes. Merging the
    // whole object can silently replace semantic surfaces and component
    // contrast rules. Only carry across the intended character palette.
    const selectedColors = (selected.colors || {}) as Record<string, string>;
    const palette = ['primary', 'secondary', 'accent', 'background', 'text', 'textHeader']
      .reduce<Record<string, string>>((result, token) => {
        if (selectedColors[token]) result[token] = selectedColors[token];
        return result;
      }, {});
    return extendTheme(omniaTheme, { colors: palette });
  }, [reyvateilThemeId]);

  const setReyvateilTheme = (reyvateilId: string) => {
    setReyvateilThemeId(reyvateilThemes[reyvateilId] ? reyvateilId : '');
    if (reyvateilThemes[reyvateilId]) localStorage.setItem('omnia-theme', reyvateilId);
    else localStorage.removeItem('omnia-theme');
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setReyvateilTheme }}>
      <ChakraProvider theme={currentTheme}>{children}</ChakraProvider>
    </ThemeContext.Provider>
  );
};
