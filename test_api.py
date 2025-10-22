#!/usr/bin/env python3
"""
Простой тест для проверки API RandomTrust
"""

import requests
import time
import json

def test_api():
    """Тестирование API endpoints"""
    
    base_url = "http://localhost:8000"
    
    print("🧪 Тестирование RandomTrust API...")
    print("=" * 50)
    
    # Тест 1: Health check
    try:
        print("1. Проверка health endpoint...")
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health check пройден")
            print(f"   Ответ: {response.json()}")
        else:
            print(f"❌ Health check не пройден: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Не удается подключиться к API. Убедитесь, что бэкенд запущен на порту 8000")
        return False
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return False
    
    # Тест 2: Генерация числа
    try:
        print("\n2. Тестирование генерации числа...")
        response = requests.get(f"{base_url}/generate?max_value=100", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Генерация успешна")
            print(f"   Число: {data['final_number']}")
            print(f"   Время генерации: {data['generation_time']:.3f}с")
            print(f"   Источников энтропии: {data['entropy_quality']['total_sources']}")
        else:
            print(f"❌ Генерация не удалась: {response.status_code}")
    except Exception as e:
        print(f"❌ Ошибка генерации: {e}")
    
    # Тест 3: Статистический анализ
    try:
        print("\n3. Тестирование статистического анализа...")
        test_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] * 10  # 100 чисел
        response = requests.post(f"{base_url}/statistics", 
                              json=test_numbers, 
                              timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Статистический анализ успешен")
            print(f"   Среднее: {data['mean']:.3f}")
            print(f"   Дисперсия: {data['variance']:.3f}")
            print(f"   P-value: {data['p_value']:.6f}")
            print(f"   Случайность: {'Да' if data['is_random'] else 'Нет'}")
        else:
            print(f"❌ Статистический анализ не удался: {response.status_code}")
    except Exception as e:
        print(f"❌ Ошибка статистического анализа: {e}")
    
    # Тест 4: Информация об источниках энтропии
    try:
        print("\n4. Получение информации об источниках энтропии...")
        response = requests.get(f"{base_url}/entropy-sources", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Информация об источниках получена")
            for source in data['sources']:
                print(f"   - {source['name']}: {source['description']}")
        else:
            print(f"❌ Не удалось получить информацию об источниках: {response.status_code}")
    except Exception as e:
        print(f"❌ Ошибка получения информации: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Тестирование завершено!")
    return True

if __name__ == "__main__":
    test_api()
