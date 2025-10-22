"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { BarChart3, Upload, CheckCircle, AlertTriangle, TrendingUp, FileText } from "lucide-react"

interface StatisticsResult {
  mean: number
  variance: number
  chi_square: number
  p_value: number
  histogram_data: number[]
  is_random: boolean
}

export function StatisticsAnalyzer() {
  const [numbers, setNumbers] = useState<number[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [statistics, setStatistics] = useState<StatisticsResult | null>(null)
  const [inputText, setInputText] = useState("")
  const [showChart, setShowChart] = useState(false)

  const parseNumbers = (text: string): number[] => {
    return text
      .split(/[\s,;|\n]+/)
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const parsedNumbers = parseNumbers(content)
        setNumbers(parsedNumbers)
        setInputText(content)
      }
      reader.readAsText(file)
    }
  }

  const handleTextInput = (text: string) => {
    setInputText(text)
    const parsedNumbers = parseNumbers(text)
    setNumbers(parsedNumbers)
  }

  const analyzeStatistics = async () => {
    if (numbers.length < 10) {
      alert("Минимум 10 чисел для анализа")
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('http://localhost:8000/statistics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(numbers)
      })
      const result: StatisticsResult = await response.json()
      setStatistics(result)
      setShowChart(true)
    } catch (error) {
      console.error('Ошибка анализа:', error)
      alert('Ошибка при анализе статистики')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateTestData = async () => {
    try {
      const response = await fetch('http://localhost:8000/generate-stream?count=1000&max_value=100')
      const result = await response.json()
      setNumbers(result)
      setInputText(result.join(', '))
    } catch (error) {
      console.error('Ошибка генерации тестовых данных:', error)
    }
  }

  const chartData = statistics?.histogram_data.map((value, index) => ({
    bin: `Бин ${index + 1}`,
    count: value,
    expected: numbers.length / 10
  })) || []

  return (
    <div className="w-full max-w-6xl space-y-6">
      <Card className="p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-4 border-cyan-300 dark:border-cyan-600/50 shadow-2xl rounded-3xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-12 h-12 text-cyan-500 dark:text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
            📊 Анализ Статистики
          </h2>
          <p className="text-cyan-600 dark:text-cyan-300 mt-2">
            Проверка качества случайности последовательности чисел
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ввод данных */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="numbers" className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
                Введите числа для анализа:
              </Label>
              <div className="mt-2 space-y-4">
                <textarea
                  id="numbers"
                  value={inputText}
                  onChange={(e) => handleTextInput(e.target.value)}
                  placeholder="Введите числа через запятую, пробел или с новой строки..."
                  className="w-full h-32 p-4 border-2 border-cyan-300 dark:border-cyan-600 rounded-xl bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 resize-none"
                />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Найдено чисел: {numbers.length}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={analyzeStatistics}
                  disabled={numbers.length < 10 || isAnalyzing}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl"
                >
                  {isAnalyzing ? "Анализ..." : "Анализировать"}
                </Button>
                <Button
                  onClick={generateTestData}
                  variant="outline"
                  className="border-2 border-cyan-300 dark:border-cyan-600 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 font-bold py-3 px-6 rounded-xl"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Тестовые данные
                </Button>
              </div>

              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileUpload}
                  accept=".txt,.csv"
                  className="hidden"
                />
                <Label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed border-cyan-300 dark:border-cyan-600 rounded-xl cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Загрузить файл
                </Label>
              </div>
            </div>
          </div>

          {/* Результаты анализа */}
          <div className="space-y-6">
            {statistics && (
              <>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4 flex items-center">
                    {statistics.is_random ? (
                      <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 mr-2 text-yellow-500" />
                    )}
                    Результат анализа
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {statistics.mean.toFixed(3)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Среднее</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {statistics.variance.toFixed(3)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Дисперсия</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {statistics.chi_square.toFixed(3)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Chi-square</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {statistics.p_value.toFixed(6)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">P-value</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Вывод:</strong> {statistics.is_random ? 
                        "Последовательность соответствует критериям случайности ✅" : 
                        "Последовательность может не быть случайной ⚠️"
                      }
                    </p>
                  </div>
                </div>

                {/* Гистограмма */}
                {showChart && (
                  <div className="bg-white dark:bg-slate-800 border-2 border-cyan-200 dark:border-cyan-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-cyan-700 dark:text-cyan-300 mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Распределение по бинам
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="bin" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#06b6d4" name="Наблюдаемое" />
                          <Bar dataKey="expected" fill="#8b5cf6" name="Ожидаемое" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
