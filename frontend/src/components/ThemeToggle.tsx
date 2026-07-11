import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [dark, setDark] = useState(() => localStorage.theme ? localStorage.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.theme = dark ? "dark" : "light";
  }, [dark]);
  return (
    <button type="button" className="icon-button" onClick={() => setDark((value) => !value)} aria-label={dark ? "Use light theme" : "Use dark theme"} data-testid="theme-toggle-button">
      {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
};