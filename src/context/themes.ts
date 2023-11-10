// create theme context for the app
import { createContext } from "react";

export const ThemeContext = createContext({
  isDarkTheme: false,
  theme: {},
  toggleTheme: () => {},
});
