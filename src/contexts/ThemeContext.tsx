// src/contexts/ThemeContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ThemeProvider, theme as defaultTheme, ChakraProvider, ThemeOverride } from "@chakra-ui/react";
import { reyvateilThemes } from "../reyvateilThemes";

interface ThemeContextProps {
  currentTheme: ThemeOverride;
  setReyvateilTheme: (reyvateilId: string) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  currentTheme: defaultTheme,
  setReyvateilTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeOverride>(defaultTheme);

  const setReyvateilTheme = (reyvateilId: string) => {
    const selectedTheme = reyvateilThemes[reyvateilId];
    if (selectedTheme) {
      setCurrentTheme(selectedTheme);
    } else {
      setCurrentTheme(defaultTheme); // Fallback to default theme
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setReyvateilTheme }}>
      <ChakraProvider theme={currentTheme}>{children}</ChakraProvider>
    </ThemeContext.Provider>
  );
};
