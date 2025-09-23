import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const getInitialTheme = () => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.dataset.theme = "dark";
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex gap-2">
      <button
        className={`px-3 py-1 rounded-lg border transition ${
          theme === "light" ? "font-bold" : "opacity-60"
        }`}
        onClick={() => setTheme("light")}
      >
        ☀️ Light
      </button>
      <button
        className={`px-3 py-1 rounded-lg border transition ${
          theme === "dark" ? "font-bold" : "opacity-60"
        }`}
        onClick={() => setTheme("dark")}
      >
        🌙 Dark
      </button>
    </div>
  );
}
