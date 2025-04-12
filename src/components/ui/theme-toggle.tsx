
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
    <div className="flex items-center">
      <Toggle 
        pressed={isDark} 
        onPressedChange={toggleTheme}
        className="rounded-full p-2 border border-black/20 dark:border-white/20 bg-transparent hover:bg-transparent"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Moon size={18} className="text-black/70 dark:text-white/70" />
        ) : (
          <Sun size={18} className="text-black/70 dark:text-white/70" />
        )}
      </Toggle>
    </div>
  );
}
