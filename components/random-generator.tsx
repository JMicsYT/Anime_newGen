"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dice5, Sparkles, Star, Eye, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface EntropySource {
  name: string
  value: string
  timestamp: number
  description: string
}

interface GenerationStep {
  step: number
  name: string
  description: string
  entropy_sources: EntropySource[]
  intermediate_result: string
  timestamp: number
}

interface GenerationResult {
  final_number: number
  steps: GenerationStep[]
  verification_hash: string
  generation_time: number
  entropy_quality: {
    total_sources: number
    total_data_size: number
    sources_quality: string[]
  }
}

export function RandomGenerator() {
  const [randomNumber, setRandomNumber] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const generateNumber = async () => {
    setIsGenerating(true)
    setCurrentStep(0)
    setGenerationResult(null)

    try {
      // Показываем анимацию сбора энтропии
      const steps = [
        "Сбор энтропии из скриншота...",
        "Анализ системных данных...",
        "Обработка временных меток...",
        "Генерация числа..."
      ]

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        await new Promise(resolve => setTimeout(resolve, 800))
      }

      // Вызываем API
      const response = await fetch('http://localhost:8000/generate?max_value=1000')
      const result: GenerationResult = await response.json()
      
      setRandomNumber(result.final_number)
      setGenerationResult(result)
    } catch (error) {
      console.error('Ошибка генерации:', error)
      // Fallback на простую генерацию
      setRandomNumber(Math.floor(Math.random() * 1000))
    } finally {
      setIsGenerating(false)
    }
  }

  const stepNames = [
    "Сбор энтропии из скриншота...",
    "Анализ системных данных...", 
    "Обработка временных меток...",
    "Генерация числа..."
  ]

  return (
    <div className="w-full max-w-6xl space-y-6">
      {/* Основной генератор */}
      <Card className="p-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-4 border-purple-300 dark:border-purple-600/50 shadow-2xl relative overflow-hidden rounded-3xl transition-colors duration-300">
        {/* Decorative elements */}
        <div className="absolute top-4 left-4">
          <Star className="w-8 h-8 text-yellow-400 dark:text-cyan-400 fill-yellow-400 dark:fill-cyan-400 animate-pulse" />
        </div>
        <div className="absolute top-4 right-4">
          <Star
            className="w-6 h-6 text-pink-400 dark:text-purple-400 fill-pink-400 dark:fill-purple-400 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
        <div className="absolute bottom-4 left-1/4">
          <Sparkles className="w-6 h-6 text-purple-400 dark:text-cyan-400 animate-bounce" />
        </div>
        <div className="absolute bottom-4 right-1/4">
          <Sparkles
            className="w-6 h-6 text-blue-400 dark:text-purple-400 animate-bounce"
            style={{ animationDelay: "0.3s" }}
          />
        </div>

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-6">
            <Dice5 className="w-20 h-20 text-purple-500 dark:text-cyan-400" />
          </div>

          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 dark:from-cyan-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
            RandomTrust Генератор 🎲
          </h2>
          <p className="text-purple-600 dark:text-cyan-300 mb-8 text-lg font-medium">
            Прозрачная генерация случайных чисел с полной верификацией
          </p>

          {/* Progress indicator */}
          {isGenerating && (
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Clock className="w-5 h-5 text-purple-500 dark:text-cyan-400 animate-spin" />
                <span className="text-purple-600 dark:text-cyan-300 font-medium">
                  {stepNames[currentStep]}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / stepNames.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Result display */}
          <div className="mb-8 min-h-[200px] flex items-center justify-center">
            {randomNumber !== null ? (
              <div className={`transition-all duration-300 ${isGenerating ? "scale-110" : "scale-100"}`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 dark:from-cyan-500 dark:to-purple-600 rounded-3xl blur-xl opacity-50 animate-pulse" />
                  <div className="relative bg-gradient-to-br from-pink-100 to-purple-100 dark:from-slate-800 dark:to-purple-900/50 rounded-3xl p-12 border-4 border-purple-300 dark:border-cyan-500/50">
                    <div className="text-8xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-cyan-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                      {randomNumber}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-6xl opacity-30 dark:text-cyan-400">?</div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={generateNumber}
              disabled={isGenerating}
              className="rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 dark:from-cyan-500 dark:via-purple-600 dark:to-blue-600 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 dark:hover:from-cyan-400 dark:hover:via-purple-500 dark:hover:to-blue-500 text-white font-bold py-6 px-12 text-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50"
            >
              {isGenerating ? "Генерация... ✨" : "Сгенерировать 🎲"}
            </Button>
            
            {generationResult && (
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="outline"
                className="rounded-full border-2 border-purple-300 dark:border-cyan-500 text-purple-600 dark:text-cyan-300 hover:bg-purple-50 dark:hover:bg-cyan-900/20 font-bold py-6 px-8 text-lg"
              >
                <Eye className="w-5 h-5 mr-2" />
                {showDetails ? "Скрыть детали" : "Показать процесс"}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Детали процесса генерации */}
      {showDetails && generationResult && (
        <Card className="p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-4 border-cyan-300 dark:border-cyan-600/50 shadow-2xl rounded-3xl">
          <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-500 to-purple-500 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
            🔍 Процесс генерации
          </h3>
          
          <div className="space-y-6">
            {generationResult.steps.map((step, index) => (
              <div key={step.step} className="border-2 border-purple-200 dark:border-purple-700 rounded-2xl p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {step.step}
                  </div>
                  <h4 className="text-xl font-bold text-purple-700 dark:text-purple-300">
                    {step.name}
                  </h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>
                
                {step.entropy_sources.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step.entropy_sources.map((source, sourceIndex) => (
                      <div key={sourceIndex} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="font-semibold text-purple-600 dark:text-purple-400">{source.name}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{source.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Хеш: {source.value}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Промежуточный результат:</strong> {step.intermediate_result}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Информация о качестве энтропии */}
            <div className="border-2 border-green-200 dark:border-green-700 rounded-2xl p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <h4 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                Качество энтропии
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {generationResult.entropy_quality.total_sources}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Источников энтропии</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {generationResult.entropy_quality.total_data_size}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Байт данных</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {generationResult.generation_time.toFixed(3)}с
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Время генерации</div>
                </div>
              </div>
            </div>
            
            {/* Хеш верификации */}
            <div className="border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <h4 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 mr-2" />
                Хеш верификации
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Этот хеш позволяет проверить подлинность генерации:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 font-mono text-sm break-all">
                {generationResult.verification_hash}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
