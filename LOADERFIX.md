# Исправление проблемы множественной загрузки SceneLoader

## 🔴 Проблема

При переходе на `/lobby` или `/game` прогресс-бар загружается **много раз** вместо одного раза. Это происходит из-за того, что модели загружаются асинхронно и каждая новая загрузка обновляет прогресс.

---

## 🔍 Причины проблемы

### 1. **Множественные вызовы `useGLTF` внутри компонентов**

**Проблема:** В сцене используется **33+ вызова `useGLTF`** в разных компонентах:
- `ItemRender` использует `useCachedModel`, который вызывает `useGLTF`
- `WindowFrameObject`, `TableObject`, `ChairObject` и другие компоненты вызывают `useGLTF` напрямую
- Каждый вызов `useGLTF` внутри Canvas триггерит загрузку и обновляет `useProgress`

**Пример:**
```tsx
// office-scene.tsx - множество таких вызовов:
const ItemRender = ({itemName}) => {
  const scene = useCachedModel(`/model/furniture/${itemName}.glb`) // useGLTF внутри
  // ...
}

// windowFrame-object.tsx
const { scene } = useGLTF(`/model/furniture/windowFrame-${color}.glb`) // еще один useGLTF
```

### 2. **Неполная предзагрузка моделей**

**Проблема:** `preloadOfficeModels()` и `preloadLobbyModels()` вызываются в `useEffect`, но:
- Не все модели предзагружаются (многие модели загружаются только при рендере)
- Предзагрузка происходит **после** монтирования компонента
- `setTimeout` в `preloadOfficeModels` задерживает загрузку, что вызывает множественные обновления прогресса

**Текущий код:**
```tsx
// office-scene.tsx
useEffect(() => {
  preloadOfficeModels() // Вызывается ПОСЛЕ рендера
}, [])

// preload-models.ts
export const preloadOfficeModels = () => {
  useGLTF.preload('/model/furniture/Office-Shelf.glb')
  // ...
  setTimeout(() => {
    useGLTF.preload('/model/furniture/flowerType1.glb') // Задержка!
  }, 1000)
}
```

### 3. **`useProgress` отслеживает все загрузки внутри Canvas**

**Проблема:** `useProgress()` из `@react-three/drei` отслеживает **все** загрузки ресурсов внутри Canvas:
- Каждый новый `useGLTF` вызов обновляет прогресс
- Если модель не предзагружена, она загружается при рендере компонента
- Множественные асинхронные загрузки вызывают множественные обновления прогресса

**Текущий код:**
```tsx
// scene-loader.tsx
const { progress, active } = useProgress() // Отслеживает ВСЕ загрузки в Canvas
```

### 4. **`useCachedModel` все равно вызывает `useGLTF`**

**Проблема:** Даже с кешированием, первый вызов `useGLTF` все равно триггерит загрузку:

```tsx
// useCachedModel.tsx
export function useCachedModel(path: string): Group {
  const gltf = useGLTF(path) // Все равно вызывает загрузку при первом использовании!
  // ...
}
```

### 5. **Отсутствие контроля состояния загрузки**

**Проблема:** Нет механизма для отслеживания, была ли загрузка уже завершена, что приводит к повторным обновлениям прогресса.

---

## ✅ Решения

### Решение 1: Предзагружать ВСЕ модели до рендеринга (РЕКОМЕНДУЕТСЯ)

**Идея:** Предзагрузить все модели **до** монтирования сцены, чтобы `useProgress` отслеживал только одну загрузку.

#### Шаг 1: Создать полный список всех моделей

```tsx
// src/shared/lib/preload-models.ts
import { useGLTF } from "@react-three/drei"

// Полный список всех моделей для офиса
export const ALL_OFFICE_MODELS = [
  '/model/furniture/Office-Shelf.glb',
  '/model/furniture/Office-Table.glb',
  '/model/furniture/windowFrame-White.glb',
  '/model/furniture/windowFrame-Black.glb',
  '/model/furniture/flowerType1.glb',
  '/model/furniture/flowerType2.glb',
  '/model/furniture/flowerType3.glb',
  '/model/furniture/trashBucket.glb',
  '/model/furniture/FourFirecase.glb',
  '/model/furniture/hangingLamp.glb',
  '/model/furniture/wallTV.glb',
  '/model/furniture/MeetingTable.glb',
  '/model/furniture/MeetingTable-Black.glb',
  '/model/furniture/DinnerTable.glb',
  '/model/furniture/DinnerChair.glb',
  '/model/furniture/DinnerBarTable.glb',
  '/model/furniture/DinnerBarChair-Black.glb',
  '/model/furniture/DinnerBarChair-Yellow.glb',
  '/model/furniture/DinnerWindow.glb',
  '/model/furniture/Radiator.glb',
  '/model/furniture/WaterStand.glb',
  '/model/furniture/Hexagon-Yellow.glb',
  '/model/furniture/Hexagon-Black.glb',
  '/model/furniture/Fridge.glb',
  '/model/furniture/SurpriseGlassWall.glb',
  '/model/furniture/ShockGlassWall.glb',
  '/model/furniture/GlassWall.glb',
  '/model/furniture/DinnerGlassWall.glb',
  '/model/furniture/OlegGlassWall.glb',
  '/model/furniture/OrangeGlassWall.glb',
  '/model/furniture/MeetingChair.glb',
  '/model/furniture/MeetingSofa.glb',
  '/model/furniture/Office-Door.glb',
  // ... добавьте все остальные модели
]

// Полный список всех моделей для лобби
export const ALL_LOBBY_MODELS = [
  '/model/furniture/CHULAKOV_logotype.glb',
  '/model/furniture/AdminTable.glb',
  '/model/furniture/graySofa.glb',
  '/model/furniture/diplomaStand.glb',
  '/model/furniture/fireCase.glb',
  '/model/furniture/sofa.glb',
  '/model/furniture/coffeeTable.glb',
  '/model/furniture/InterCome.glb',
  '/model/furniture/PaperStack.glb',
  '/model/furniture/magazineStack.glb',
  '/model/furniture/penaplastLogotype.glb',
  '/model/furniture/candyBowl.glb',
  '/model/furniture/grassCarpet.glb',
  '/model/furniture/purpleSofa.glb',
  '/model/furniture/yellowSOfa.glb',
  '/model/furniture/LobbyBanner.glb',
  '/model/furniture/Office-Chair.glb',
  '/model/furniture/computer.glb',
  '/model/furniture/Office-Door.glb',
  // ... добавьте все остальные модели
]

// Предзагрузка всех моделей сразу
export const preloadOfficeModels = () => {
  ALL_OFFICE_MODELS.forEach(model => {
    useGLTF.preload(model)
  })
}

export const preloadLobbyModels = () => {
  ALL_LOBBY_MODELS.forEach(model => {
    useGLTF.preload(model)
  })
}
```

#### Шаг 2: Предзагружать модели ДО рендеринга

```tsx
// src/entities/scene/ui/office-scene.tsx
"use client";
import { preloadOfficeModels, ALL_OFFICE_MODELS } from "@/shared/lib/preload-models";

// Предзагружаем ВСЕ модели ДО рендеринга компонента
if (typeof window !== 'undefined') {
  ALL_OFFICE_MODELS.forEach(model => {
    useGLTF.preload(model)
  })
}

export function OfficeScene() {
  // useEffect больше не нужен для предзагрузки
  // ...
}
```

**Проблема:** `useGLTF.preload` нельзя вызывать вне компонента. Нужно другое решение.

#### Шаг 3: Использовать хук для предзагрузки

```tsx
// src/hooks/usePreloadModels.ts
"use client";
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { ALL_OFFICE_MODELS, ALL_LOBBY_MODELS } from "@/shared/lib/preload-models";

export function usePreloadModels(scene: 'office' | 'lobby') {
  const models = scene === 'office' ? ALL_OFFICE_MODELS : ALL_LOBBY_MODELS;
  
  useEffect(() => {
    // Предзагружаем все модели сразу
    models.forEach(model => {
      useGLTF.preload(model);
    });
  }, []);
}

// Использование:
export function OfficeScene() {
  usePreloadModels('office'); // Предзагружаем ДО рендеринга Canvas
  // ...
}
```

---

### Решение 2: Использовать состояние для контроля загрузки (ПРОСТОЕ РЕШЕНИЕ)

**Идея:** Отслеживать состояние загрузки и показывать лоадер только один раз.

#### Шаг 1: Обновить `SceneLoader` с состоянием

```tsx
// src/shared/ui/Loader/scene-loader.tsx
"use client";
import { useProgress } from '@react-three/drei'
import { useState, useEffect } from 'react'

export default function SceneLoader() {
  const { progress, active } = useProgress()
  const [hasShown, setHasShown] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  // Отслеживаем, когда загрузка началась
  useEffect(() => {
    if (active && !hasShown) {
      setHasShown(true)
    }
  }, [active, hasShown])
  
  // Отслеживаем, когда загрузка завершена
  useEffect(() => {
    if (!active && progress === 100 && hasShown) {
      // Небольшая задержка для плавного скрытия
      const timer = setTimeout(() => {
        setIsComplete(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [active, progress, hasShown])
  
  // Показываем лоадер только если загрузка началась и не завершена
  if (!hasShown || isComplete) {
    return null
  }
  
  return (
    <section className="absolute z-50 inset-0 bg-gray-900">
      <div className="h-full flex flex-col justify-center items-center gap-6">
        <h2 className="text-2xl text-yellow-200">IT Genetics</h2>
        <span className="text-lg text-yellow-500">
          Загрузка: {Math.round(progress)}%
        </span>
        <div className="w-[50%] h-2 rounded-full bg-gray-700 overflow-hidden">
          <div 
            className="h-full bg-yellow-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  )
}
```

**Проблема:** Это не решает проблему множественных обновлений прогресса, только скрывает их.

---

### Решение 3: Предзагружать модели через Promise (ЛУЧШЕЕ РЕШЕНИЕ)

**Идея:** Предзагружать все модели через Promise и показывать лоадер только один раз.

#### Шаг 1: Создать функцию предзагрузки через Promise

```tsx
// src/shared/lib/preload-models.ts
import { useGLTF } from "@react-three/drei"

// Функция для предзагрузки модели через Promise
const preloadModel = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      useGLTF.preload(url)
      // Даем время на загрузку
      setTimeout(() => resolve(), 100)
    } catch (error) {
      reject(error)
    }
  })
}

// Предзагрузка всех моделей офиса
export const preloadAllOfficeModels = async (): Promise<void> => {
  const models = [
    '/model/furniture/Office-Shelf.glb',
    '/model/furniture/Office-Table.glb',
    '/model/furniture/windowFrame-White.glb',
    '/model/furniture/windowFrame-Black.glb',
    // ... все остальные модели
  ]
  
  await Promise.all(models.map(model => preloadModel(model)))
}

// Предзагрузка всех моделей лобби
export const preloadAllLobbyModels = async (): Promise<void> => {
  const models = [
    '/model/furniture/CHULAKOV_logotype.glb',
    '/model/furniture/AdminTable.glb',
    // ... все остальные модели
  ]
  
  await Promise.all(models.map(model => preloadModel(model)))
}
```

**Проблема:** `useGLTF.preload` не возвращает Promise и не может быть использован таким образом.

---

### Решение 4: Использовать глобальное состояние загрузки (РЕКОМЕНДУЕТСЯ)

**Идея:** Создать глобальное состояние для отслеживания загрузки и показывать лоадер только один раз.

#### Шаг 1: Создать стор для загрузки

```tsx
// src/widgets/store/loading-store.ts
import { create } from 'zustand'

interface LoadingState {
  isLoading: boolean
  progress: number
  setLoading: (loading: boolean) => void
  setProgress: (progress: number) => void
  reset: () => void
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  progress: 0,
  setLoading: (loading) => set({ isLoading: loading }),
  setProgress: (progress) => set({ progress }),
  reset: () => set({ isLoading: false, progress: 0 }),
}))
```

#### Шаг 2: Обновить `SceneLoader`

```tsx
// src/shared/ui/Loader/scene-loader.tsx
"use client";
import { useProgress } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { useLoadingStore } from '@/widgets/store/loading-store'

export default function SceneLoader() {
  const { progress, active } = useProgress()
  const { isLoading, setLoading, setProgress } = useLoadingStore()
  const hasStartedRef = useRef(false)
  
  useEffect(() => {
    // Когда загрузка начинается впервые
    if (active && !hasStartedRef.current) {
      hasStartedRef.current = true
      setLoading(true)
    }
    
    // Обновляем прогресс
    if (active) {
      setProgress(progress)
    }
    
    // Когда загрузка завершена
    if (!active && progress === 100 && hasStartedRef.current) {
      setTimeout(() => {
        setLoading(false)
        hasStartedRef.current = false
      }, 300)
    }
  }, [active, progress, setLoading, setProgress])
  
  if (!isLoading) {
    return null
  }
  
  return (
    <section className="absolute z-50 inset-0 bg-gray-900">
      <div className="h-full flex flex-col justify-center items-center gap-6">
        <h2 className="text-2xl text-yellow-200">IT Genetics</h2>
        <span className="text-lg text-yellow-500">
          Загрузка: {Math.round(progress)}%
        </span>
        <div className="w-[50%] h-2 rounded-full bg-gray-700 overflow-hidden">
          <div 
            className="h-full bg-yellow-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  )
}
```

#### Шаг 3: Сбрасывать состояние при переходе между страницами

```tsx
// src/entities/scene/ui/office-scene.tsx
import { useLoadingStore } from '@/widgets/store/loading-store'

export function OfficeScene() {
  const { reset } = useLoadingStore()
  
  useEffect(() => {
    // Сбрасываем состояние при монтировании
    reset()
    
    return () => {
      // Сбрасываем при размонтировании
      reset()
    }
  }, [reset])
  
  // ...
}
```

---

### Решение 5: Исправить `useCachedModel` для использования предзагруженных моделей

**Идея:** Обновить `useCachedModel`, чтобы он не вызывал загрузку, если модель уже предзагружена.

```tsx
// src/hooks/useCachedModel.tsx
"use client";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Group } from "three";

const sceneCache = new Map<string, Group>();

export function useCachedModel(path: string): Group {
  // Используем useGLTF, но модель должна быть предзагружена
  const gltf = useGLTF(path);

  const scene = useMemo(() => {
    // Проверяем кеш
    if (sceneCache.has(path)) {
      return sceneCache.get(path)!;
    }

    // Клонируем и кешируем
    const cloned = gltf.scene.clone();
    sceneCache.set(path, cloned);
    return cloned;
  }, [gltf.scene, path]);

  return scene;
}
```

**Проблема:** `useGLTF` все равно будет триггерить загрузку, если модель не предзагружена.

---

## 🎯 Рекомендуемое решение (Комбинация)

### Шаг 1: Создать полный список всех моделей

```tsx
// src/shared/lib/preload-models.ts
import { useGLTF } from "@react-three/drei"

// Полный список ВСЕХ моделей для офиса
export const ALL_OFFICE_MODELS = [
  '/model/furniture/Office-Shelf.glb',
  '/model/furniture/Office-Table.glb',
  '/model/furniture/windowFrame-White.glb',
  '/model/furniture/windowFrame-Black.glb',
  '/model/furniture/flowerType1.glb',
  '/model/furniture/flowerType2.glb',
  '/model/furniture/flowerType3.glb',
  '/model/furniture/trashBucket.glb',
  '/model/furniture/FourFirecase.glb',
  '/model/furniture/hangingLamp.glb',
  '/model/furniture/wallTV.glb',
  '/model/furniture/MeetingTable.glb',
  '/model/furniture/MeetingTable-Black.glb',
  '/model/furniture/DinnerTable.glb',
  '/model/furniture/DinnerChair.glb',
  '/model/furniture/DinnerBarTable.glb',
  '/model/furniture/DinnerBarChair-Black.glb',
  '/model/furniture/DinnerBarChair-Yellow.glb',
  '/model/furniture/DinnerWindow.glb',
  '/model/furniture/Radiator.glb',
  '/model/furniture/WaterStand.glb',
  '/model/furniture/Hexagon-Yellow.glb',
  '/model/furniture/Hexagon-Black.glb',
  '/model/furniture/Fridge.glb',
  '/model/furniture/SurpriseGlassWall.glb',
  '/model/furniture/ShockGlassWall.glb',
  '/model/furniture/GlassWall.glb',
  '/model/furniture/DinnerGlassWall.glb',
  '/model/furniture/OlegGlassWall.glb',
  '/model/furniture/OrangeGlassWall.glb',
  '/model/furniture/MeetingChair.glb',
  '/model/furniture/MeetingSofa.glb',
  '/model/furniture/Office-Door.glb',
]

// Полный список ВСЕХ моделей для лобби
export const ALL_LOBBY_MODELS = [
  '/model/furniture/CHULAKOV_logotype.glb',
  '/model/furniture/AdminTable.glb',
  '/model/furniture/graySofa.glb',
  '/model/furniture/diplomaStand.glb',
  '/model/furniture/fireCase.glb',
  '/model/furniture/sofa.glb',
  '/model/furniture/coffeeTable.glb',
  '/model/furniture/InterCome.glb',
  '/model/furniture/PaperStack.glb',
  '/model/furniture/magazineStack.glb',
  '/model/furniture/penaplastLogotype.glb',
  '/model/furniture/candyBowl.glb',
  '/model/furniture/grassCarpet.glb',
  '/model/furniture/purpleSofa.glb',
  '/model/furniture/yellowSOfa.glb',
  '/model/furniture/LobbyBanner.glb',
  '/model/furniture/Office-Chair.glb',
  '/model/furniture/computer.glb',
  '/model/furniture/Office-Door.glb',
]

// Предзагрузка всех моделей офиса
export const preloadOfficeModels = () => {
  ALL_OFFICE_MODELS.forEach(model => {
    useGLTF.preload(model)
  })
}

// Предзагрузка всех моделей лобби
export const preloadLobbyModels = () => {
  ALL_LOBBY_MODELS.forEach(model => {
    useGLTF.preload(model)
  })
}
```

### Шаг 2: Обновить `SceneLoader` с защитой от множественных обновлений

```tsx
// src/shared/ui/Loader/scene-loader.tsx
"use client";
import { useProgress } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'

export default function SceneLoader() {
  const { progress, active } = useProgress()
  const [isVisible, setIsVisible] = useState(false)
  const hasShownRef = useRef(false)
  const completionTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    // Когда загрузка начинается впервые
    if (active && !hasShownRef.current) {
      hasShownRef.current = true
      setIsVisible(true)
    }
    
    // Когда загрузка завершена
    if (!active && progress === 100 && hasShownRef.current) {
      // Очищаем предыдущий таймер, если есть
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current)
      }
      
      // Небольшая задержка для плавного скрытия
      completionTimerRef.current = setTimeout(() => {
        setIsVisible(false)
        hasShownRef.current = false
      }, 300)
    }
    
    return () => {
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current)
      }
    }
  }, [active, progress])
  
  // Не показываем лоадер, если он уже был показан и завершен
  if (!isVisible) {
    return null
  }
  
  return (
    <section className="absolute z-50 inset-0 bg-gray-900">
      <div className="h-full flex flex-col justify-center items-center gap-6">
        <h2 className="text-2xl text-yellow-200">IT Genetics</h2>
        <span className="text-lg text-yellow-500">
          Загрузка: {Math.round(progress)}%
        </span>
        <div className="w-[50%] h-2 rounded-full bg-gray-700 overflow-hidden">
          <div 
            className="h-full bg-yellow-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  )
}
```

### Шаг 3: Предзагружать все модели в начале компонента

```tsx
// src/entities/scene/ui/office-scene.tsx
"use client";
import { preloadOfficeModels, ALL_OFFICE_MODELS } from "@/shared/lib/preload-models";
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export function OfficeScene() {
  const [playerPosition, setPlayerPosition] = useState<Vector3 | null>(null)
  const [activeNPC, setActiveNPC] = useState<{id: number, name: string} | null>(null)
  
  // Предзагружаем ВСЕ модели сразу при монтировании
  useEffect(() => {
    // Предзагружаем все модели сразу, без задержек
    ALL_OFFICE_MODELS.forEach(model => {
      useGLTF.preload(model)
    })
  }, [])
  
  // ... остальной код
}
```

---

## 📋 Чеклист исправления

1. ✅ Создать полный список всех моделей (`ALL_OFFICE_MODELS`, `ALL_LOBBY_MODELS`)
2. ✅ Обновить `SceneLoader` с защитой от множественных обновлений
3. ✅ Предзагружать все модели сразу при монтировании компонента
4. ✅ Убрать `setTimeout` из `preloadOfficeModels`
5. ✅ Убрать `useEffect` для предзагрузки, если модели предзагружаются в начале

---

## 🎯 Ожидаемый результат

После исправления:
- ✅ Прогресс-бар показывается **только один раз** при загрузке сцены
- ✅ Все модели предзагружаются **до** рендеринга
- ✅ Нет множественных обновлений прогресса
- ✅ Плавное скрытие лоадера после завершения загрузки

---

## 🔧 Дополнительные улучшения

### 1. Добавить индикатор загрузки конкретных моделей

```tsx
// Можно добавить отображение, какие модели загружаются
const [loadingModel, setLoadingModel] = useState<string>('')

useEffect(() => {
  // Отслеживаем загрузку конкретных моделей
  // ...
}, [])
```

### 2. Кешировать загруженные модели в localStorage

```tsx
// Сохранять информацию о загруженных моделях
// для ускорения последующих загрузок
```

### 3. Использовать Service Worker для кеширования

```tsx
// Кешировать модели через Service Worker
// для мгновенной загрузки при повторных посещениях
```

