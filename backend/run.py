#!/usr/bin/env python3
"""
Скрипт для запуска RandomTrust API сервера
"""

import uvicorn
import sys
import os

# Добавляем текущую директорию в путь
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("🚀 Запуск RandomTrust API сервера...")
    print("📡 API будет доступен по адресу: http://localhost:8000")
    print("📚 Документация API: http://localhost:8000/docs")
    print("🔍 Health check: http://localhost:8000/health")
    print("\n" + "="*50)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
