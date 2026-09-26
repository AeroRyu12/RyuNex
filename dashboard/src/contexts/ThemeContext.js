import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const ThemeContext = createContext(void 0);
const themes = [
  {
    value: "dark",
    label: "Dark",
    colors: { primary: "#3B82F6", secondary: "#1F2937" }
  },
  {
    value: "blue",
    label: "Ocean Blue",
    colors: { primary: "#0EA5E9", secondary: "#0F172A" }
  },
  {
    value: "purple",
    label: "Purple",
    colors: { primary: "#8B5CF6", secondary: "#1E1B4B" }
  },
  {
    value: "green",
    label: "Forest Green",
    colors: { primary: "#10B981", secondary: "#064E3B" }
  },
  {
    value: "orange",
    label: "Slate Professional",
    colors: { primary: "#64748B", secondary: "#334155" }
  },
  {
    value: "teal",
    label: "Ocean Teal",
    colors: { primary: "#14B8A6", secondary: "#134E4A" }
  },
  {
    value: "cyberpunk",
    label: "Cyberpunk",
    colors: { primary: "#EC4899", secondary: "#831843" }
  },
  {
    value: "sunset",
    label: "Emerald Pro",
    colors: { primary: "#059669", secondary: "#065F46" }
  },
  {
    value: "corporate",
    label: "Corporate Navy",
    colors: { primary: "#1E40AF", secondary: "#1E3A8A" }
  }
];
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
function setCookie(name, value, days = 365) {
  const expires = /* @__PURE__ */ new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1e3);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}
function ThemeProvider({ children }) {
  const [defaultTheme, setDefaultTheme] = useState("dark");
  const [theme, setTheme] = useState("dark");
  const [isUsingDefault, setIsUsingDefault] = useState(true);
  useEffect(() => {
    const loadThemeSettings = async () => {
      try {
        let organizationDefaultTheme = "dark";
        try {
          const response = await axios.get("/api/settings/theme");
          organizationDefaultTheme = response.data?.defaultTheme || "dark";
        } catch (serverError) {
          const localDefaultTheme = localStorage.getItem("dashboard-default-theme");
          if (localDefaultTheme) {
            organizationDefaultTheme = localDefaultTheme;
          } else {
          }
        }
        setDefaultTheme(organizationDefaultTheme);
        const userThemeCookie = getCookie("user-theme-preference");
        if (userThemeCookie && userThemeCookie !== "default") {
          setTheme(userThemeCookie);
          setIsUsingDefault(false);
        } else {
          setTheme(organizationDefaultTheme);
          setIsUsingDefault(true);
        }
      } catch (error) {
        console.error("Failed to load theme settings:", error);
        const userThemeCookie = getCookie("user-theme-preference");
        if (userThemeCookie && userThemeCookie !== "default") {
          setTheme(userThemeCookie);
          setIsUsingDefault(false);
        } else {
          setTheme("dark");
          setIsUsingDefault(true);
        }
      }
    };
    loadThemeSettings();
  }, []);
  useEffect(() => {
    localStorage.setItem("dashboard-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
    setCookie("user-theme-preference", newTheme);
    setIsUsingDefault(false);
  };
  const handleSetDefaultTheme = async (newDefaultTheme) => {
    try {
      localStorage.setItem("dashboard-default-theme", newDefaultTheme);
      setDefaultTheme(newDefaultTheme);
      const userThemeCookie = getCookie("user-theme-preference");
      if (!userThemeCookie || userThemeCookie === "default") {
        setTheme(newDefaultTheme);
        localStorage.setItem("dashboard-theme", newDefaultTheme);
        document.documentElement.setAttribute("data-theme", newDefaultTheme);
        setIsUsingDefault(true);
      }
      try {
        const response = await axios.put("/api/settings/theme", { defaultTheme: newDefaultTheme });
      } catch (serverError) {
      }
    } catch (error) {
      console.error("Failed to update default theme:", error);
      throw error;
    }
  };
  const resetToDefault = () => {
    setTheme(defaultTheme);
    setCookie("user-theme-preference", "default");
    setIsUsingDefault(true);
  };
  const value = {
    theme,
    setTheme: handleSetTheme,
    themes,
    defaultTheme,
    setDefaultTheme: handleSetDefaultTheme,
    isUsingDefault
  };
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value, children });
}
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === void 0) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
export {
  ThemeProvider,
  themes,
  useTheme
};
