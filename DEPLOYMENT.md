# 🚀 Инструкции по развертыванию RandomTrust

## Локальное развертывание

### Windows
```bash
# Запуск через batch файл
start.bat

# Или вручную:
# 1. Установите зависимости
npm install
cd backend
pip install -r requirements.txt
cd ..

# 2. Запустите бэкенд
cd backend
python run.py

# 3. В новом терминале запустите фронтенд
npm run dev
```

### Linux/macOS
```bash
# Запуск через shell скрипт
./start.sh

# Или вручную:
# 1. Установите зависимости
npm install
cd backend
pip3 install -r requirements.txt
cd ..

# 2. Запустите бэкенд
cd backend
python3 run.py

# 3. В новом терминале запустите фронтенд
npm run dev
```

## Облачное развертывание

### Vercel (Frontend) + Railway (Backend)

1. **Развертывание фронтенда на Vercel:**
   - Подключите GitHub репозиторий к Vercel
   - Настройте переменные окружения
   - Деплой автоматически

2. **Развертывание бэкенда на Railway:**
   - Создайте новый проект в Railway
   - Подключите GitHub репозиторий
   - Настройте `railway.json`:
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "cd backend && python run.py",
       "healthcheckPath": "/health"
     }
   }
   ```

### Docker развертывание

1. **Создайте Dockerfile для бэкенда:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .
EXPOSE 8000

CMD ["python", "run.py"]
```

2. **Создайте docker-compose.yml:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1
  
  frontend:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Запуск:**
```bash
docker-compose up --build
```

## Настройка окружения

### Переменные окружения

Создайте файл `.env.local` в корне проекта:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=RandomTrust
```

### Настройка CORS

В `backend/main.py` настройте CORS для продакшена:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Замените на ваш домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Мониторинг и логи

### Логи бэкенда
```bash
# Просмотр логов
tail -f backend/logs/app.log

# Или через Docker
docker logs randomtrust-backend
```

### Мониторинг производительности
- Используйте `psutil` для мониторинга ресурсов
- Настройте алерты на высокую нагрузку
- Мониторьте время отклика API

## Безопасность

### HTTPS
- Настройте SSL сертификаты
- Используйте Let's Encrypt для бесплатных сертификатов
- Принудительное перенаправление на HTTPS

### Ограничения API
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/generate")
@limiter.limit("10/minute")  # Максимум 10 запросов в минуту
async def generate_random_number(request: Request, max_value: int = 1000):
    # ...
```

### Аутентификация (опционально)
```python
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import JWTAuthentication

# Добавьте JWT аутентификацию для защиты API
```

## Масштабирование

### Горизонтальное масштабирование
- Используйте Redis для кеширования
- Настройте load balancer
- Разделите фронтенд и бэкенд на разные серверы

### Вертикальное масштабирование
- Увеличьте RAM и CPU
- Оптимизируйте алгоритмы генерации
- Используйте асинхронную обработку

## Резервное копирование

### База данных (если используется)
```bash
# Создание бэкапа
pg_dump randomtrust > backup.sql

# Восстановление
psql randomtrust < backup.sql
```

### Файлы конфигурации
- Сохраните все конфигурационные файлы в Git
- Используйте секреты для чувствительных данных
- Настройте автоматические бэкапы

## Мониторинг здоровья

### Health checks
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": "1.0.0",
        "entropy_sources": len(get_entropy_sources())
    }
```

### Метрики
- Время генерации чисел
- Количество запросов в секунду
- Использование памяти и CPU

## Устранение неполадок

### Частые проблемы

1. **Ошибка CORS:**
   - Проверьте настройки CORS в бэкенде
   - Убедитесь, что фронтенд обращается к правильному URL

2. **Ошибка подключения к API:**
   - Проверьте, что бэкенд запущен на порту 8000
   - Проверьте файрвол и сетевые настройки

3. **Ошибки Python зависимостей:**
   - Обновите pip: `pip install --upgrade pip`
   - Переустановите зависимости: `pip install -r requirements.txt --force-reinstall`

### Логи для отладки
```bash
# Включите debug режим
export DEBUG=1
python run.py

# Или через переменные окружения
DEBUG=1 python run.py
```

## Производительность

### Оптимизация бэкенда
- Используйте `uvloop` для асинхронности
- Настройте connection pooling
- Кешируйте часто используемые данные

### Оптимизация фронтенда
- Используйте Next.js Image optimization
- Настройте CDN для статических файлов
- Минимизируйте bundle size

## Заключение

Следуйте этим инструкциям для успешного развертывания RandomTrust в любой среде. При возникновении проблем обращайтесь к логам и документации используемых сервисов.
