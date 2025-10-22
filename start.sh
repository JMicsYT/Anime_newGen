#!/bin/bash

echo "🚀 Запуск RandomTrust приложения..."
echo "=================================="

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Пожалуйста, установите Node.js 18+"
    exit 1
fi

# Проверяем наличие Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python не найден. Пожалуйста, установите Python 3.8+"
    exit 1
fi

# Проверяем наличие pip
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip не найден. Пожалуйста, установите pip"
    exit 1
fi

echo "✅ Все зависимости найдены"

# Устанавливаем зависимости фронтенда
echo "📦 Установка зависимостей фронтенда..."
npm install

# Устанавливаем зависимости бэкенда
echo "📦 Установка зависимостей бэкенда..."
cd backend
pip3 install -r requirements.txt

# Запускаем бэкенд в фоне
echo "🔧 Запуск бэкенд сервера..."
python3 run.py &
BACKEND_PID=$!

# Ждем запуска бэкенда
sleep 3

# Возвращаемся в корневую директорию
cd ..

# Запускаем фронтенд
echo "🎨 Запуск фронтенд приложения..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Приложение запущено!"
echo "📡 Backend API: http://localhost:8000"
echo "🌐 Frontend: http://localhost:3000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Для остановки нажмите Ctrl+C"

# Функция для остановки процессов
cleanup() {
    echo ""
    echo "🛑 Остановка приложения..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Приложение остановлено"
    exit 0
}

# Перехватываем сигнал остановки
trap cleanup SIGINT SIGTERM

# Ждем завершения
wait
