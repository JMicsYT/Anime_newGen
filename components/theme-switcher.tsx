"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 dark:from-indigo-700 dark:to-purple-800 shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group border-4 border-white dark:border-cyan-400/40"
      aria-label="Toggle theme"
    >
      {/* Cute anime-style icons */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sun icon with cute face */}
        <div
          className={`absolute transition-all duration-500 ${
            isDark ? "opacity-0 rotate-180 scale-0" : "opacity-100 rotate-0 scale-100"
          }`}
        >
          <div className="relative">
            <Sun className="w-7 h-7 text-yellow-300 fill-yellow-300" />
            {/* Cute eyes */}
            <div className="absolute top-2 left-1.5 flex gap-1">
              <div className="w-1 h-1 bg-orange-600 rounded-full" />
              <div className="w-1 h-1 bg-orange-600 rounded-full" />
            </div>
            {/* Cute smile */}
            <div className="absolute top-3 left-1.5 w-3 h-1.5 border-b-2 border-orange-600 rounded-full" />
          </div>
        </div>

        {/* Moon icon with cute face */}
        <div
          className={`absolute transition-all duration-500 ${
            isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-0"
          }`}
        >
          <div className="relative">
            <Moon className="w-7 h-7 text-cyan-200 fill-cyan-200" />
            {/* Cute sleepy eyes */}
            <div className="absolute top-2 left-2 flex gap-1">
              <div className="w-1.5 h-0.5 bg-indigo-700 rounded-full" />
              <div className="w-1.5 h-0.5 bg-indigo-700 rounded-full" />
            </div>
            {/* Cute smile */}
            <div className="absolute top-3.5 left-2 w-2.5 h-1 border-b-2 border-indigo-700 rounded-full" />
          </div>
        </div>
      </div>

      {/* Sparkle effect on hover */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 dark:bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 dark:bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse delay-75" />
    </button>
  )
}
