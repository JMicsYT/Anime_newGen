"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, CheckCircle, XCircle, Clock, Hash, Eye } from "lucide-react"

interface VerificationResult {
  is_valid: boolean
  calculated_hash: string
  provided_hash: string
  verification_time: number
}

export function VerificationTool() {
  const [number, setNumber] = useState("")
  const [verificationHash, setVerificationHash] = useState("")
  const [steps, setSteps] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const verifyGeneration = async () => {
    if (!number || !verificationHash || !steps) {
      alert("Заполните все поля")
      return
    }

    setIsVerifying(true)
    try {
      // Парсим шаги из JSON
      let parsedSteps
      try {
        parsedSteps = JSON.parse(steps)
      } catch (e) {
        alert("Неверный формат JSON для шагов")
        return
      }

      const requestData = {
        number: parseInt(number),
        steps: parsedSteps,
        verification_hash: verificationHash
      }

      const response = await fetch('http://localhost:8000/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })
      
      const result: VerificationResult = await response.json()
      setVerificationResult(result)
    } catch (error) {
      console.error('Ошибка верификации:', error)
      alert('Ошибка при верификации')
    } finally {
      setIsVerifying(false)
    }
  }

  const loadExampleData = () => {
    setNumber("42")
    setVerificationHash("a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456")
    setSteps(`[
      {
        "step": 1,
        "name": "Сбор энтропии",
        "description": "Собираем случайные данные",
        "entropy_sources": [
          {
            "name": "Скриншот экрана",
            "value": "abc123",
            "timestamp": 1234567890,
            "description": "Пиксели экрана"
          }
        ],
        "intermediate_result": "def456",
        "timestamp": 1234567890
      }
    ]`)
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      <Card className="p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-4 border-green-300 dark:border-green-600/50 shadow-2xl rounded-3xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-green-500 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
            🔒 Верификация Тиражей
          </h2>
          <p className="text-green-600 dark:text-green-300 mt-2">
            Проверка подлинности сгенерированных чисел
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ввод данных */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="number" className="text-lg font-semibold text-green-700 dark:text-green-300">
                Сгенерированное число:
              </Label>
              <Input
                id="number"
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Введите число"
                className="mt-2 border-2 border-green-300 dark:border-green-600 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="hash" className="text-lg font-semibold text-green-700 dark:text-green-300">
                Хеш верификации:
              </Label>
              <Input
                id="hash"
                value={verificationHash}
                onChange={(e) => setVerificationHash(e.target.value)}
                placeholder="Введите хеш верификации"
                className="mt-2 border-2 border-green-300 dark:border-green-600 rounded-xl font-mono"
              />
            </div>

            <div>
              <Label htmlFor="steps" className="text-lg font-semibold text-green-700 dark:text-green-300">
                Шаги генерации (JSON):
              </Label>
              <textarea
                id="steps"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="Введите JSON с шагами генерации..."
                className="mt-2 w-full h-32 p-4 border-2 border-green-300 dark:border-green-600 rounded-xl bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 resize-none font-mono text-sm"
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={verifyGeneration}
                disabled={!number || !verificationHash || !steps || isVerifying}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl"
              >
                {isVerifying ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Проверка...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Проверить
                  </>
                )}
              </Button>
              <Button
                onClick={loadExampleData}
                variant="outline"
                className="border-2 border-green-300 dark:border-green-600 text-green-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 font-bold py-3 px-6 rounded-xl"
              >
                <Eye className="w-4 h-4 mr-2" />
                Пример
              </Button>
            </div>
          </div>

          {/* Результаты верификации */}
          <div className="space-y-6">
            {verificationResult && (
              <>
                <div className={`border-2 rounded-xl p-6 ${
                  verificationResult.is_valid 
                    ? "border-green-200 dark:border-green-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                    : "border-red-200 dark:border-red-700 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20"
                }`}>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    {verificationResult.is_valid ? (
                      <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 mr-2 text-red-500" />
                    )}
                    Результат верификации
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${
                        verificationResult.is_valid 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {verificationResult.is_valid ? "✅ ПОДЛИННЫЙ" : "❌ ПОДДЕЛКА"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Время проверки: {verificationResult.verification_time.toFixed(3)}с
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                          Предоставленный хеш:
                        </Label>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 font-mono text-sm break-all">
                          {verificationResult.provided_hash}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                          Вычисленный хеш:
                        </Label>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 font-mono text-sm break-all">
                          {verificationResult.calculated_hash}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Детали верификации */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-4 flex items-center">
                    <Hash className="w-5 h-5 mr-2" />
                    Как работает верификация
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <p>1. <strong>Воссоздание данных:</strong> Система воссоздает исходные данные из предоставленных шагов</p>
                    <p>2. <strong>Вычисление хеша:</strong> Применяется та же хеш-функция SHA-256 к воссозданным данным</p>
                    <p>3. <strong>Сравнение:</strong> Вычисленный хеш сравнивается с предоставленным</p>
                    <p>4. <strong>Результат:</strong> Совпадение означает подлинность, несовпадение - подделку</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
