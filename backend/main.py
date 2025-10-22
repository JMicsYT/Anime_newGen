from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import time
import hashlib
import json
import os
import psutil
from PIL import ImageGrab
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import io
import base64

app = FastAPI(title="RandomTrust API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EntropySource(BaseModel):
    name: str
    value: str
    timestamp: float
    description: str

class GenerationStep(BaseModel):
    step: int
    name: str
    description: str
    entropy_sources: List[EntropySource]
    intermediate_result: str
    timestamp: float

class GenerationResult(BaseModel):
    final_number: int
    steps: List[GenerationStep]
    verification_hash: str
    generation_time: float
    entropy_quality: Dict[str, Any]

class StatisticsResult(BaseModel):
    mean: float
    variance: float
    chi_square: float
    p_value: float
    histogram_data: List[int]
    is_random: bool

class VerificationRequest(BaseModel):
    number: int
    steps: List[GenerationStep]
    verification_hash: str

def entropy_screenshot():
    """Сбор энтропии из скриншота экрана"""
    try:
        img = ImageGrab.grab()
        pixels = img.tobytes()
        return {
            "name": "Скриншот экрана",
            "value": hashlib.sha256(pixels).hexdigest()[:16],
            "description": f"Пиксели экрана ({len(pixels)} байт)",
            "data_size": len(pixels)
        }
    except Exception as e:
        return {
            "name": "Скриншот экрана (ошибка)",
            "value": str(e)[:16],
            "description": f"Ошибка: {str(e)}",
            "data_size": 0
        }

def entropy_timing():
    """Сбор энтропии из времени"""
    timing = time.perf_counter()
    return {
        "name": "Время выполнения",
        "value": str(timing)[:16],
        "description": f"Точное время: {timing:.10f}",
        "data_size": len(str(timing).encode())
    }

def entropy_system():
    """Сбор системной энтропии"""
    try:
        sys_data = f'{os.getpid()}-{psutil.cpu_percent()}-{psutil.virtual_memory().percent}'
        return {
            "name": "Системные данные",
            "value": hashlib.sha256(sys_data.encode()).hexdigest()[:16],
            "description": f"PID: {os.getpid()}, CPU: {psutil.cpu_percent()}%, RAM: {psutil.virtual_memory().percent}%",
            "data_size": len(sys_data.encode())
        }
    except Exception as e:
        return {
            "name": "Системные данные (ошибка)",
            "value": str(e)[:16],
            "description": f"Ошибка: {str(e)}",
            "data_size": 0
        }

def entropy_memory():
    """Сбор энтропии из памяти процесса"""
    try:
        memory_info = psutil.Process().memory_info()
        memory_data = f"{memory_info.rss}-{memory_info.vms}-{time.time_ns()}"
        return {
            "name": "Память процесса",
            "value": hashlib.sha256(memory_data.encode()).hexdigest()[:16],
            "description": f"RSS: {memory_info.rss}, VMS: {memory_info.vms}",
            "data_size": len(memory_data.encode())
        }
    except Exception as e:
        return {
            "name": "Память процесса (ошибка)",
            "value": str(e)[:16],
            "description": f"Ошибка: {str(e)}",
            "data_size": 0
        }

@app.get("/")
async def root():
    return {"message": "RandomTrust API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": time.time()}

@app.get("/generate", response_model=GenerationResult)
async def generate_random_number(max_value: int = 1000):
    """Генерация случайного числа с полной визуализацией процесса"""
    start_time = time.time()
    steps = []
    
    # Шаг 1: Сбор энтропии
    step1_start = time.time()
    entropy_sources = [
        entropy_screenshot(),
        entropy_timing(),
        entropy_system(),
        entropy_memory()
    ]
    
    # Преобразуем в формат EntropySource
    entropy_objects = []
    for source in entropy_sources:
        entropy_objects.append(EntropySource(
            name=source["name"],
            value=source["value"],
            timestamp=time.time(),
            description=source["description"]
        ))
    
    # Объединяем все источники энтропии
    combined_entropy = b''
    for source in entropy_sources:
        combined_entropy += source["value"].encode()
    
    step1 = GenerationStep(
        step=1,
        name="Сбор энтропии",
        description="Собираем случайные данные из различных источников",
        entropy_sources=entropy_objects,
        intermediate_result=hashlib.sha256(combined_entropy).hexdigest(),
        timestamp=time.time()
    )
    steps.append(step1)
    
    # Шаг 2: Обработка энтропии
    step2_start = time.time()
    processed_entropy = hashlib.sha256(combined_entropy).digest()
    
    step2 = GenerationStep(
        step=2,
        name="Обработка энтропии",
        description="Применяем криптографические хеш-функции для улучшения случайности",
        entropy_sources=[],
        intermediate_result=processed_entropy.hex(),
        timestamp=time.time()
    )
    steps.append(step2)
    
    # Шаг 3: Генерация финального числа
    step3_start = time.time()
    final_number = int.from_bytes(processed_entropy, 'big') % max_value
    
    step3 = GenerationStep(
        step=3,
        name="Генерация числа",
        description=f"Преобразуем обработанную энтропию в число от 0 до {max_value-1}",
        entropy_sources=[],
        intermediate_result=str(final_number),
        timestamp=time.time()
    )
    steps.append(step3)
    
    # Создаем хеш для верификации
    verification_data = {
        "number": final_number,
        "steps": [step.dict() for step in steps],
        "timestamp": time.time()
    }
    verification_hash = hashlib.sha256(json.dumps(verification_data, sort_keys=True).encode()).hexdigest()
    
    # Анализ качества энтропии
    entropy_quality = {
        "total_sources": len(entropy_sources),
        "total_data_size": sum(source.get("data_size", 0) for source in entropy_sources),
        "sources_quality": [source["name"] for source in entropy_sources]
    }
    
    generation_time = time.time() - start_time
    
    return GenerationResult(
        final_number=final_number,
        steps=steps,
        verification_hash=verification_hash,
        generation_time=generation_time,
        entropy_quality=entropy_quality
    )

@app.get("/generate-stream", response_model=List[int])
async def generate_stream(count: int = 1000, max_value: int = 1000):
    """Генерация потока случайных чисел"""
    if count > 10000:
        raise HTTPException(status_code=400, detail="Максимум 10000 чисел за раз")
    
    numbers = []
    for _ in range(count):
        # Быстрая генерация для потока
        entropy = f"{time.perf_counter()}-{os.getpid()}-{psutil.cpu_percent()}".encode()
        hash_result = hashlib.sha256(entropy).digest()
        number = int.from_bytes(hash_result, 'big') % max_value
        numbers.append(number)
    
    return numbers

@app.post("/statistics", response_model=StatisticsResult)
async def analyze_statistics(numbers: List[int]):
    """Анализ статистических свойств последовательности"""
    if len(numbers) < 10:
        raise HTTPException(status_code=400, detail="Минимум 10 чисел для анализа")
    
    # Базовые статистики
    mean = np.mean(numbers)
    variance = np.var(numbers)
    
    # Chi-square тест
    observed, _ = np.histogram(numbers, bins=10)
    expected = [len(numbers) / 10] * 10
    chi2, p_value = stats.chisquare(observed, expected)
    
    # Гистограмма
    histogram_data = observed.tolist()
    
    # Определяем, является ли последовательность случайной
    is_random = p_value > 0.05 and 0.4 < mean / max(numbers) < 0.6
    
    return StatisticsResult(
        mean=mean,
        variance=variance,
        chi_square=chi2,
        p_value=p_value,
        histogram_data=histogram_data,
        is_random=is_random
    )

@app.post("/verify")
async def verify_generation(request: VerificationRequest):
    """Верификация сгенерированного числа"""
    # Воссоздаем хеш для проверки
    verification_data = {
        "number": request.number,
        "steps": [step.dict() for step in request.steps],
        "timestamp": time.time()
    }
    calculated_hash = hashlib.sha256(json.dumps(verification_data, sort_keys=True).encode()).hexdigest()
    
    is_valid = calculated_hash == request.verification_hash
    
    return {
        "is_valid": is_valid,
        "calculated_hash": calculated_hash,
        "provided_hash": request.verification_hash,
        "verification_time": time.time()
    }

@app.get("/entropy-sources")
async def get_entropy_sources():
    """Получение информации об источниках энтропии"""
    return {
        "sources": [
            {
                "name": "Скриншот экрана",
                "description": "Случайные пиксели с экрана пользователя",
                "entropy_level": "Высокий",
                "reliability": "Средний"
            },
            {
                "name": "Время выполнения",
                "description": "Точное время выполнения операций",
                "entropy_level": "Средний",
                "reliability": "Высокий"
            },
            {
                "name": "Системные данные",
                "description": "CPU, память, PID процесса",
                "entropy_level": "Средний",
                "reliability": "Высокий"
            },
            {
                "name": "Память процесса",
                "description": "Информация о памяти процесса",
                "entropy_level": "Средний",
                "reliability": "Высокий"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
