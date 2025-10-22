"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Heart, Sparkles } from "lucide-react"

interface LoginFormProps {
  onLogin: (username: string) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      setError("Введите имя пользователя")
      return
    }
    if (!password.trim()) {
      setError("Введите пароль")
      return
    }

    setIsLoading(true)
    setError("")
    
    try {
      // Проверяем подключение к API
      const response = await fetch('http://localhost:8000/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('API недоступен')
      }
      
      // Симуляция аутентификации
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Проверяем простые учетные данные
      if (username === "admin" && password === "admin") {
        onLogin(username.trim())
      } else if (username === "demo" && password === "demo") {
        onLogin(username.trim())
      } else {
        setError("Неверные учетные данные. Используйте admin/admin или demo/demo")
      }
    } catch (error) {
      setError("Ошибка подключения к серверу. Убедитесь, что бэкенд запущен на порту 8000")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-4 border-pink-300 dark:border-cyan-500/50 shadow-2xl relative overflow-hidden rounded-3xl transition-colors duration-300">
      {/* Decorative corner elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-300 dark:from-cyan-500/30 dark:to-purple-600/30 rounded-bl-full opacity-50" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-300 to-purple-300 dark:from-blue-600/30 dark:to-purple-700/30 rounded-tr-full opacity-50" />

      <div className="relative z-10">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Heart className="w-16 h-16 text-pink-500 dark:text-cyan-400 fill-pink-500 dark:fill-cyan-400 animate-pulse" />
            <Sparkles className="w-6 h-6 text-yellow-400 dark:text-cyan-300 absolute -top-2 -right-2 animate-spin-slow" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:from-cyan-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
          Добро пожаловать! ✨
        </h1>
        <p className="text-center text-purple-600 dark:text-cyan-300 mb-8 font-medium">Войдите в волшебный мир</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-purple-700 dark:text-cyan-300 font-semibold">
              Имя пользователя
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-2xl border-2 border-pink-300 dark:border-cyan-500/50 focus:border-purple-400 dark:focus:border-cyan-400 bg-pink-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-cyan-50"
              placeholder="Введите ваше имя"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-purple-700 dark:text-cyan-300 font-semibold">
              Пароль
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl border-2 border-pink-300 dark:border-cyan-500/50 focus:border-purple-400 dark:focus:border-cyan-400 bg-pink-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-cyan-50"
              placeholder="Введите пароль"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:from-cyan-500 dark:via-purple-600 dark:to-blue-600 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 dark:hover:from-cyan-400 dark:hover:via-purple-500 dark:hover:to-blue-500 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Проверка подключения..." : "Войти 🌸"}
          </Button>
        </form>
      </div>
    </Card>
  )
}
