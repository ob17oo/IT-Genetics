# ОБЗОР КОДА ОТ SENIOR WEB DEVELOPER
## Проект chulakov-game

---

**Дата рассмотрения:** 26 ноября 2025  
**Рецензент:** Senior Full-Stack Web Developer (10+ лет опыта)  
**Проект:** Next.js 16 + React Three Fiber (r3f) 3D интерактивная игра/сцена  
**Общая оценка:** 6.8/10 — Хороший прототип, требует серьёзного рефакторинга перед production  

---

## КРАТКОЕ РЕЗЮМЕ

Этот проект демонстрирует **хорошую архитектурную базу** (FSD подход, изоляция компонентов, современный стек) но содержит **критические пробелы в производительности, типизации и поддерживаемости**. Код работает, но не следует дисциплине в обработке ошибок, тестировании и масштабируемости.

**Критические проблемы:**
1. ⚠️ **Нет Error Boundaries** — вся игра падает при ошибке загрузки модели
2. ⚠️ **Слабая типизация** — ручное приведение типов `as unknown as RigidApi`, неправильные пропсы
3. ⚠️ **Нет тестов** — невозможно рефакторить с уверенностью
4. ⚠️ **Бутылочные горлышки производительности** — все модели загружаются при старте, нет LOD, нет lazy-loading
5. ⚠️ **Магические числа** — таймаут 5000ms, множители масштаба разбросаны везде

---

## ПОДРОБНЫЙ АНАЛИЗ КОМПОНЕНТОВ И СТРУКТУРЫ

### 1. **Архитектура (FSD) — 7/10**

**Что хорошо:**
- Структура папок соответствует FSD: `entities/`, `features/`, `shared/`, `widgets/`
- Чёткое разделение ответственности: сцены, персонажи, объекты, хранилище
- Использование Zustand для управления состоянием (проще Redux, хороший выбор)

**Проблемы:**
- **Слабое обеспечение границ слоёв** — компоненты импортируют из неправильных слоёв
  - Пример: `lobby-scene.tsx` импортирует объекты напрямую; нужно импортировать из индекса `entities/objects`
  - Нет barrel exports для обеспечения границ

- **Повторяющиеся конфиг-объекты** — `WALL_CONFIGS`, `DOOR_CONFIGS`, `DIPLOMA_CONFIGS` захардкодены в компонентах
  - Должны находиться в `shared/scene-config/` с типами
  - Усложняет изменения и тестирование

- **Папка shared перегружена** — `constants/`, `lib/`, `types/`, `ui/` всё смешано
  - Лучше: создать `shared/scene-config/`, `shared/physics/`, `shared/asset-loaders/`

**Рекомендация Senior:**
```typescript
// Создать shared/scene-config/types.ts
export interface WallConfig {
  position: [number, number, number];
  size: [number, number, number];
  rotation: [number, number, number];
}

// Создать shared/scene-config/lobby-config.ts
export const LOBBY_WALLS: WallConfig[] = [...]

// В компонентах:
import { LOBBY_WALLS } from '@/shared/scene-config/lobby-config'
```

---

### 2. **Качество кода и TypeScript — 6/10**

**Что хорошо:**
- TypeScript включён везде
- Пропсы компонентов типизированы
- Хранилища Zustand используют TypeScript

**Критические проблемы:**

**Проблема A: Небезопасное приведение типов**
```typescript
// ❌ ПЛОХО (character-controller.tsx, строка ~25)
type RigidApi = {
  linvel: () => { x: number; y: number; z: number }
  setLinvel: (v: { x: number; y: number; z: number }, wake: boolean) => void
  translation: () => { x: number; y: number; z: number }
}

// Позже:
ref={(api) => { rb.current = (api as unknown as RigidApi) }}  // ❌ ОПАСНО!
```

**Проблема:** Это отключает TypeScript и скрывает ошибки runtime.

**Исправление Senior:**
```typescript
import { RapierRigidBody } from '@react-three/rapier'

ref={(api) => { rb.current = api }}  // ✅ Используй правильные типы из библиотеки
```

**Проблема B: Отсутствие валидации пропсов**
```typescript
// ❌ ПЛОХО (lobby-scene.tsx)
function LobbySofa({scale = 0.1, position, rotation}: LobbySofaProps){
  // Нет проверки что position/rotation это кортежи
  const {scene} = useGLTF('/model/furniture/lobbySofa.glb')
  return <primitive object={scene} ... />
}
```

**Исправление Senior:**
```typescript
import { z } from 'zod'  // или io-ts

const SofaPropsSchema = z.object({
  scale: z.number().default(0.1),
  position: z.tuple([z.number(), z.number(), z.number()]).optional(),
  rotation: z.tuple([z.number(), z.number(), z.number()]).optional(),
})

function LobbySofa(props: z.infer<typeof SofaPropsSchema>) {
  const validated = SofaPropsSchema.parse(props)
  // ... безопасное использование
}
```

**Проблема C: Литеральные значения в JSX**
```typescript
// ❌ ПЛОХО (table-object.tsx)
<mesh position={[-2.5, -0.3, 1]} castShadow>  // Магические числа!
<boxGeometry args={[0.2, 2.5, 0.2]} />
```

**Исправление Senior:**
```typescript
const CHAIR_LEG = { position: [-2.5, -0.3, 1] as const, size: [0.2, 2.5, 0.2] as const }

<mesh position={CHAIR_LEG.position} castShadow>
  <boxGeometry args={CHAIR_LEG.size} />
</mesh>
```

---

### 3. **Производительность и оптимизация — 5/10**

**Текущий подход:**
- ✅ `useGLTF.preload()` для асинхронной загрузки
- ✅ `useMemo()` для массивов конфигов
- ✅ `Suspense` с fallback
- ✅ Physics с Rapier (хороший выбор)

**Критические проблемы:**

**Проблема A: Все модели загружаются при старте**
```typescript
// src/shared/lib/preload-models.ts
useGLTF.preload('/model/furniture/computer.glb')  // ❌ Даже если невидима!
useGLTF.preload('/model/furniture/sofa.glb')
// ... ВСЕ модели загружаются, даже если юзер никогда не посетит комнату
```

**Влияние:** 5-10MB моделей загружается даже для простых сцен.

**Исправление Senior:**
```typescript
// Создать hooks/useAssetLoader.ts
export const useAssetLoader = (paths: string[]) => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    paths.forEach(path => useGLTF.preload(path))
    setLoaded(true)
  }, [paths])
  return loaded
}

// В сценах:
function OfficeScene() {
  const officeAssetsLoaded = useAssetLoader(OFFICE_SCENE_ASSETS)
  
  return (
    <Suspense fallback={<SceneLoader />}>
      {officeAssetsLoaded && <SceneContent />}
    </Suspense>
  )
}
```

**Проблема B: Нет LOD (Level of Detail)**
```typescript
// ❌ Всегда рендерит таблицу в полном качестве
<TableObject position={[-13, 0, 14]} />  // Далеко, но всё ещё полные меши!
```

**Исправление Senior:**
```typescript
// Создать components/LODObject.tsx
export function LODObject({ near, mid, far, distance }: LODProps) {
  const distToCamera = useDistanceToCamera()
  
  if (distToCamera < 5) return near
  if (distToCamera < 15) return mid
  return far
}

// Использование:
<LODObject
  near={<TableObject />}
  mid={<SimplifiedTable />}
  far={<PlaceholderCube />}
  distance={20}
/>
```

**Проблема C: Захардкодированный таймаут 5s**
```typescript
// ❌ ПЛОХО (scene-loader.tsx)
const timer = setTimeout(() => {
  setShowLoader(false)
}, 5000)  // А если сеть медленная?
```

**Исправление Senior:**
```typescript
import { useProgress } from '@react-three/drei'

export default function SceneLoader() {
  const { progress, active } = useProgress()
  
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
      {/* Автоматически скрывается при 100% */}
      {!active && <div className="absolute inset-0" />}
    </section>
  )
}
```

**Проблема D: Несогласованность путей preload**
```typescript
// ❌ НЕСОГЛАСОВАННО (preload-models.ts)
useGLTF.preload('/model/furniture/computer.glb')      // С /
useGLTF.preload('model/furniture/sofa.glb')          // Без /
useGLTF.preload('model/furniture/CHULAKOV_logotype.glb')  // Без /
```

**Влияние:** Промахи кэша, дублирование загрузок.

---

### 4. **Character Controller — 6/10**

**Что хорошо:**
- Плавное следование камеры
- Управление WASD работает
- Интеграция с physics

**Проблемы:**

**Проблема: Ручной Ray Casting для обнаружения земли**
```typescript
// ❌ Ручной ray для проверки земли
const ray = new rapier.Ray({ x: t.x, y: footY, z: t.z }, { x: 0, y: -1, z: 0 })
const hit = world.castRay(ray, 0.2, true)
if (hit && vel.y < 0) {
  vel.y = 0
}
```

**Лучше:** Использовать встроенный API `CharacterController` от Rapier.

**Исправление Senior:**
```typescript
import { RapierRigidBody } from '@react-three/rapier'
import { useRapier } from '@react-three/rapier'

// Используй встроенный character controller от Rapier
export function CharacterController({ position = [0, 5, 0] }: CharacterProps) {
  const { rapier, world } = useRapier()
  const rb = useRef<RapierRigidBody>(null)
  
  const characterController = useMemo(() => {
    return world.createCharacterController(0.01)  // Встроенное обнаружение земли
  }, [world])
  
  // ... остальной код
}
```

---

### 5. **Управление состоянием (Zustand) — 7/10**

**Что хорошо:**
- Простая структура хранилища
- Нет boilerplate как в Redux
- Type-safe запросы

**Отсутствует:**
- ❌ Нет состояний ошибок
- ❌ Нет состояний загрузки  
- ❌ Нет middleware валидации
- ❌ Нет стратегии гидратации для SSR

**Рекомендация Senior:**
```typescript
// До:
export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

// После:
interface AuthState {
  user: User | null
  loading: boolean
  error: Error | null
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))

// С middleware:
const storeWithPersist = create(
  persist(
    (set) => ({ /* ... */ }),
    { name: 'auth-store' }
  )
)
```

---

### 6. **Отсутствует: Error Boundaries — КРИТИЧНО 0/10**

**Текущее состояние:** Ничего. Вся игра падает если:
- Модель не загружается
- Physics engine падает
- Character controller ломается
- Рендер сцены падает

**Реализация Senior:**
```typescript
// Создать shared/ui/ErrorBoundary.tsx
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: (error: Error) => ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Scene error:', error, errorInfo)
    // Отправь на систему отслеживания ошибок (Sentry, etc.)
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback?.(this.state.error) ?? (
          <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="text-center">
              <h1 className="text-2xl text-red-500">Ошибка загрузки сцены</h1>
              <p className="text-gray-400">{this.state.error.message}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-yellow-500 rounded"
              >
                Перезагрузить
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

// Использование в layout:
<ErrorBoundary>
  <Canvas>
    <Physics>
      <SceneContent />
    </Physics>
  </Canvas>
</ErrorBoundary>
```

---

### 7. **Отсутствует: Тестирование — КРИТИЧНО 0/10**

**Текущее:** Нет тестов вообще.

**Проблемы:**
- Невозможно рефакторить без поломок
- Нет обнаружения регрессий
- Нет уверенности в изменениях

**Рекомендация Senior:**
```typescript
// Тест: src/__tests__/preload-models.test.ts
import { describe, it, expect, vi } from 'vitest'
import { useGLTF } from '@react-three/drei'

vi.mock('@react-three/drei')

describe('Preload Models', () => {
  it('должен предзагружать все нужные модели', () => {
    import('@/shared/lib/preload-models')
    
    expect(useGLTF.preload).toHaveBeenCalledWith('/model/furniture/computer.glb')
    expect(useGLTF.preload).toHaveBeenCalledWith('/model/furniture/sofa.glb')
    // Проверь консистентность
  })
})

// Тест: src/__tests__/CharacterController.test.tsx
import { render, screen } from '@testing-library/react'
import { CharacterController } from '@/entities/characters/third-person-character/character-controller'

describe('CharacterController', () => {
  it('должен рендерить с позицией по умолчанию', () => {
    const { container } = render(<CharacterController />)
    expect(container).toBeInTheDocument()
  })

  it('должен обновлять анимацию на основе input', () => {
    // Тест переходов анимации
  })
})
```

**Установка:**
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0"
  }
}
```

---

## СВОДКА ИЗМЕНЕНИЙ (По приоритетам)

| # | Категория | Текущее | Изменение | Влияние | Время |
|---|-----------|---------|-----------|---------|------|
| **1** | Обработка ошибок | Нет | Добавить ErrorBoundary + try-catch | Предотвратит падения | 2ч |
| **2** | Типизация | Небезопасно | Убрать `as unknown as`, использовать типы | Ловить баги рано | 1ч |
| **3** | Пути preload | Несогласованно | Сделать абсолютные пути (`/model/...`) | Исправить кэш | 30m |
| **4** | UX лоадера | Жёсткий timeout | Использовать `useProgress()` | Лучше UX | 1ч |
| **5** | Повторный конфиг | Захардкодирован | Перенести в `shared/scene-config/` | Поддерживаемость | 3ч |
| **6** | Тестирование | Нет | Добавить Vitest + testing-library | Уверенность | 4ч |
| **7** | LOD/Производ. | Нет LOD | Реализовать LOD компоненты | 2x буст | 8ч |
| **8** | Zustand | Базовый | Добавить loading/error + middleware | Лучше UX | 2ч |

---

## РЕКОМЕНДУЕМЫЙ ПЛАН РЕФАКТОРИНГА (3 недели)

### Неделя 1: Стабильность (High Risk → Medium Risk)
- День 1: Добавить ErrorBoundary ко всем сценам
- День 2: Исправить TypeScript приведение типов
- День 3: Сделать пути активов консистентными
- День 4-5: Настроить Vitest + написать базовые тесты

### Неделя 2: Производительность (Medium Risk → Low Risk)
- День 1-2: Реализовать LOD компоненты
- День 3: Перенести preloading на lazy on-demand
- День 4-5: Оптимизировать лоадер с `useProgress()`

### Неделя 3: Поддерживаемость
- День 1-2: Извлечь конфиги сцены
- День 3: Улучшить Zustand хранилища с middleware
- День 4-5: Добавить мониторинг + профилирование

---

## БЫСТРЫЕ ПОБЕДЫ (Сделай сегодня)

1. **Исправить пути preload (30 min)**
   ```bash
   grep -r "useGLTF.preload('model/" src/
   # Замени все на /model/
   ```

2. **Заменить жёсткий timeout в SceneLoader (1 час)**
   - Импортируй `useProgress`
   - Показывай реальный процент загрузки
   - Автоскрывай при 100%

3. **Добавить одну ErrorBoundary (1 час)**
   - Обёрни Canvas компоненты
   - Ловись ошибки рендера
   - Показывай юзер-фриндли сообщение

---

## ЧЕСТНАЯ ОЦЕНКА

**Твои сильные стороны:**
- ✅ Хороший выбор стека технологий
- ✅ Основа FSD структуры
- ✅ Модульные компоненты
- ✅ Современный tooling (Next.js, TypeScript)

**Слабости, которые тебя сдерживают:**
- ❌ Нет типизации (приведение типов)
- ❌ Нет обработки ошибок (падения)
- ❌ Нет тестов (нельзя рефакторить безопасно)
- ❌ Нет мониторинга производительности (летаешь вслепую)
- ❌ Захардкодированные конфиги (не масштабируемо)

**Чтобы пойти от "Прототип" → "Production Ready":**
1. Сначала стабилизируй (error boundaries, типизация)
2. Потом оптимизируй (LOD, lazy-loading, профилирование)
3. Потом масштабируй (тесты, CI/CD, мониторинг)

---

**Следующий шаг:** Выбери одну категорию выше и я предоставлю точный код + дифы для внедрения. Что начнём в первую очередь?
