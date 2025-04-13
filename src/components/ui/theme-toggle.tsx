
"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Toggle } from "@/components/ui/toggle";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <Toggle 
      pressed={isDark} 
      onPressedChange={toggleTheme}
      className="rounded-full p-2 hover:bg-white/10 dark:hover:bg-black/20"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon size={18} className="text-white/70" />
      ) : (
        <Sun size={18} className="text-black/70" />
      )}
    </Toggle>
  );
}
