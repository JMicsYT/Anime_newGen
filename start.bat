@echo off
echo 🚀 Запуск RandomTrust приложения...
echo ==================================

REM Проверяем наличие Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не найден. Пожалуйста, установите Node.js 18+
    pause
    exit /b 1
)

REM Проверяем наличие Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python не найден. Пожалуйста, установите Python 3.8+
    pause
    exit /b 1
)

echo ✅ Все зависимости найдены

REM Устанавливаем зависимости фронтенда
echo 📦 Установка зависимостей фронтенда...
call npm install

REM Устанавливаем зависимости бэкенда
echo 📦 Установка зависимостей бэкенда...
cd backend
call pip install -r requirements.txt

REM Запускаем бэкенд в фоне
echo 🔧 Запуск бэкенд сервера...
start /b python run.py

REM Ждем запуска бэкенда
timeout /t 3 /nobreak >nul

REM Возвращаемся в корневую директорию
cd ..

REM Запускаем фронтенд
echo 🎨 Запуск фронтенд приложения...
start /b npm run dev

echo.
echo 🎉 Приложение запущено!
echo 📡 Backend API: http://localhost:8000
echo 🌐 Frontend: http://localhost:3000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Для остановки закройте это окно или нажмите любую клавишу
pause
