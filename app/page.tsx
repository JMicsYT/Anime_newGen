"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { RandomGenerator } from "@/components/random-generator"
import { StatisticsAnalyzer } from "@/components/statistics-analyzer"
import { VerificationTool } from "@/components/verification-tool"
import { UserProfile } from "@/components/user-profile"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Sparkles, Dice5, User, BarChart3, Shield } from "lucide-react"

export default function Home() {
  const [currentView, setCurrentView] = useState<"login" | "generator" | "statistics" | "verification" | "profile">("login")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (username: string) => {
    setIsLoggedIn(true)
    setCurrentView("generator")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 dark:from-[#0f0a2e] dark:via-[#1a1147] dark:to-[#0d1b3a] relative overflow-hidden transition-colors duration-500">
      <ThemeSwitcher />

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300/30 dark:bg-purple-500/15 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-300/30 dark:bg-indigo-500/15 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-300/30 dark:bg-cyan-500/15 rounded-full blur-xl animate-float" />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-yellow-300/30 dark:bg-teal-500/15 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute top-20 right-1/4 w-2 h-2 bg-yellow-400 dark:bg-cyan-400 rounded-full animate-pulse" />
        <div className="absolute bottom-40 right-1/3 w-1.5 h-1.5 bg-pink-400 dark:bg-purple-400 rounded-full animate-pulse delay-100" />
        <div className="absolute top-1/2 left-20 w-2.5 h-2.5 bg-purple-400 dark:bg-teal-400 rounded-full animate-pulse delay-200" />
      </div>

      {/* Navigation */}
      {isLoggedIn && (
        <nav className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setCurrentView("generator")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg ${
                currentView === "generator"
                  ? "bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 dark:from-purple-600 dark:via-indigo-600 dark:to-cyan-600 text-white shadow-2xl scale-110 border-4 border-white dark:border-cyan-400/50"
                  : "bg-white/90 dark:bg-indigo-900/70 text-purple-600 dark:text-cyan-300 hover:bg-white dark:hover:bg-indigo-800/80 hover:scale-105 border-3 border-pink-200 dark:border-indigo-700"
              }`}
            >
              <Dice5 className="w-5 h-5" />
              <span>Генератор</span>
            </button>
            <button
              onClick={() => setCurrentView("statistics")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg ${
                currentView === "statistics"
                  ? "bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 dark:from-purple-600 dark:via-indigo-600 dark:to-cyan-600 text-white shadow-2xl scale-110 border-4 border-white dark:border-cyan-400/50"
                  : "bg-white/90 dark:bg-indigo-900/70 text-purple-600 dark:text-cyan-300 hover:bg-white dark:hover:bg-indigo-800/80 hover:scale-105 border-3 border-pink-200 dark:border-indigo-700"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Анализ</span>
            </button>
            <button
              onClick={() => setCurrentView("verification")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg ${
                currentView === "verification"
                  ? "bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 dark:from-purple-600 dark:via-indigo-600 dark:to-cyan-600 text-white shadow-2xl scale-110 border-4 border-white dark:border-cyan-400/50"
                  : "bg-white/90 dark:bg-indigo-900/70 text-purple-600 dark:text-cyan-300 hover:bg-white dark:hover:bg-indigo-800/80 hover:scale-105 border-3 border-pink-200 dark:border-indigo-700"
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>Верификация</span>
            </button>
            <button
              onClick={() => setCurrentView("profile")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg ${
                currentView === "profile"
                  ? "bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 dark:from-purple-600 dark:via-indigo-600 dark:to-cyan-600 text-white shadow-2xl scale-110 border-4 border-white dark:border-cyan-400/50"
                  : "bg-white/90 dark:bg-indigo-900/70 text-purple-600 dark:text-cyan-300 hover:bg-white dark:hover:bg-indigo-800/80 hover:scale-105 border-3 border-pink-200 dark:border-indigo-700"
              }`}
            >
              <User className="w-5 h-5" />
              <span>Профиль</span>
            </button>
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        {!isLoggedIn && currentView === "login" && <LoginForm onLogin={handleLogin} />}
        {isLoggedIn && currentView === "generator" && <RandomGenerator />}
        {isLoggedIn && currentView === "statistics" && <StatisticsAnalyzer />}
        {isLoggedIn && currentView === "verification" && <VerificationTool />}
        {isLoggedIn && currentView === "profile" && <UserProfile />}
      </main>

      {/* Sparkles decoration */}
      <div className="absolute bottom-10 right-10 pointer-events-none">
        <Sparkles className="w-12 h-12 text-yellow-400 dark:text-cyan-400 animate-pulse" />
      </div>
    </div>
  )
}
