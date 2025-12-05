# Руководство по оптимизации проекта Chulakov Game

## Содержание
1. [Оптимизация 3D моделей](#оптимизация-3d-моделей)
2. [Оптимизация React Three Fiber](#оптимизация-react-three-fiber)
3. [Оптимизация физики (Rapier)](#оптимизация-физики-rapier)
4. [Оптимизация Next.js](#оптимизация-nextjs)
5. [Оптимизация рендеринга](#оптимизация-рендеринга)
6. [Управление памятью](#управление-памятью)
7. [Оптимизация состояния (Zustand)](#оптимизация-состояния-zustand)
8. [Структура кода](#структура-кода)

---

## Оптимизация 3D моделей

### 1. Использование InstancedMesh для повторяющихся объектов

**Проблема:** В `office-scene.tsx` множество одинаковых объектов (столы, окна, стены) рендерятся как отдельные компоненты.

**Решение:** Используйте `InstancedMesh` для объектов с одинаковой геометрией:

```tsx
import { useMemo, useRef } from 'react'
import { InstancedMesh } from 'three'

// Пример для окон
const WindowInstances = ({ positions, rotations, scales }) => {
  const meshRef = useRef<InstancedMesh>(null)
  const { scene } = useGLTF('/model/furniture/windowFrame-Black.glb')
  
  useMemo(() => {
    if (!meshRef.current) return
    
    positions.forEach((pos, i) => {
      const matrix = new Matrix4()
      matrix.compose(
        new Vector3(...pos),
        new Quaternion().setFromEuler(new Euler(...rotations[i])),
        new Vector3(...scales[i])
      )
      meshRef.current.setMatrixAt(i, matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [positions, rotations, scales])
  
  return <primitive ref={meshRef} object={scene} />
}
```

**Применение:**
- Окна (`WINDOW_POSITIONS` - 40+ экземпляров)
- Столы (`TABLE_POSITIONS` - 7 экземпляров)
- Стены (если возможно объединить)

### 2. Оптимизация предзагрузки моделей

**Текущая проблема:** В `preload-models.ts` все модели загружаются сразу при старте.

**Решение:** Ленивая загрузка по сценам:

```tsx
// src/shared/lib/preload-models.ts
export const preloadOfficeModels = () => {
  // Загружаем только критичные модели сразу
  useGLTF.preload('/model/furniture/Office-Table.glb')
  useGLTF.preload('/model/furniture/Office-Shelf.glb')
  
  // Остальные загружаем асинхронно
  setTimeout(() => {
    useGLTF.preload('/model/furniture/flowerType1.glb')
    useGLTF.preload('/model/furniture/flowerType2.glb')
    // ...
  }, 1000)
}
```

### 3. Использование Clone вместо повторной загрузки

**Проблема:** В `office-scene.tsx` компонент `ItemRender` загружает модель каждый раз через `useGLTF`.

**Решение:** Используйте `Clone` из `@react-three/drei`:

```tsx
// Создайте один раз модель
const WindowModel = () => {
  const { scene } = useGLTF('/model/furniture/windowFrame-Black.glb')
  return <primitive object={scene} />
}

// Затем клонируйте
const WindowInstances = ({ positions }) => {
  const { scene } = useGLTF('/model/furniture/windowFrame-Black.glb')
  
  return (
    <>
      {positions.map((pos, i) => (
        <Clone key={i} object={scene} position={pos} />
      ))}
    </>
  )
}
```

### 4. Оптимизация размера GLB файлов

**Рекомендации:**
- Используйте Draco compression для GLB файлов
- Оптимизируйте текстуры (WebP, сжатие)
- Уменьшите количество полигонов в моделях
- Используйте инструменты типа `gltf-pipeline`:

```bash
npm install -g gltf-pipeline
gltf-pipeline -i model.glb -o model-optimized.glb -d
```

---

## Оптимизация React Three Fiber

### 1. Использование useFrame для оптимизации обновлений

**Проблема:** Компоненты перерендериваются каждый кадр.

**Решение:** Используйте `useFrame` только когда необходимо:

```tsx
import { useFrame } from '@react-three/fiber'

const OptimizedComponent = () => {
  const meshRef = useRef()
  
  // Обновляем только при необходимости
  useFrame((state, delta) => {
    // Только если нужно анимировать
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })
  
  return <mesh ref={meshRef}>...</mesh>
}
```

### 2. Мемоизация сложных вычислений

**Хорошо:** В `office-scene.tsx` уже используется `useMemo` для стен и окон.

**Улучшение:** Добавьте мемоизацию для всех массивов объектов:

```tsx
const windowCircle = useMemo(
  () => WINDOW_POSITIONS.map((window, i) => (
    <RigidBody key={i} type="fixed">
      <WindowFrameObject {...window} />
    </RigidBody>
  )),
  [] // Зависимости только если нужно
)
```

### 3. Использование React.memo для компонентов

**Решение:** Оберните компоненты в `React.memo`:

```tsx
export const WallObject = React.memo(({ widthSize, heightSize, ... }) => {
  // ...
})
```

### 4. Оптимизация Canvas настроек

**Текущая проблема:** В `office-scene.tsx` Canvas без оптимизаций.

**Решение:**

```tsx
<Canvas
  shadows
  camera={{ position: [0, 1.7, 10], fov: 75 }}
  gl={{
    antialias: false, // Отключить для производительности
    powerPreference: "high-performance",
    stencil: false,
    depth: true,
  }}
  dpr={[1, 2]} // Адаптивный DPR
  performance={{ min: 0.5 }} // Автоматическое снижение качества
>
```

---

## Оптимизация физики (Rapier)

### 1. Оптимизация коллайдеров

**Проблема:** В `office-scene.tsx` множество `RigidBody` с `type="fixed"`.

**Решение:**
- Используйте `colliders={false}` и явные коллайдеры только где нужно
- Объединяйте коллайдеры где возможно
- Используйте простые формы (CuboidCollider вместо MeshCollider)

```tsx
// Плохо: отдельный RigidBody для каждого объекта
{tables.map((table, i) => (
  <RigidBody key={i} type="fixed">
    <TableObject {...table} />
  </RigidBody>
))}

// Хорошо: один RigidBody с несколькими коллайдерами
<RigidBody type="fixed">
  {tables.map((table, i) => (
    <group key={i}>
      <TableObject {...table} />
      <CuboidCollider args={[...]} position={table.position} />
    </group>
  ))}
</RigidBody>
```

### 2. Настройка Physics World

**Решение:** Оптимизируйте настройки физики:

```tsx
<Physics
  gravity={[0, -20, 0]}
  timeStep={1/60} // Фиксированный шаг
  maxStabilizationIterations={1} // Уменьшить итерации
  maxVelocityIterations={4}
>
```

### 3. Отключение физики для статических объектов

**Решение:** Для полностью статичных объектов используйте `type="fixed"` и минимальные коллайдеры:

```tsx
// Для декоративных объектов без физики
<RigidBody type="fixed" colliders={false}>
  <ItemRender itemName="flowerType1" />
</RigidBody>
```

---

## Оптимизация Next.js

### 1. Code Splitting для сцен

**Проблема:** Все сцены загружаются в один бандл.

**Решение:** Динамический импорт:

```tsx
// src/app/(main)/game/page.tsx
import dynamic from 'next/dynamic'

const OfficeScene = dynamic(
  () => import('@/entities/scene/ui/office-scene'),
  { 
    loading: () => <SceneLoader />,
    ssr: false // Отключить SSR для 3D сцен
  }
)

export default function GamePage() {
  return <OfficeScene />
}
```

### 2. Оптимизация изображений и статики

**Решение:** Используйте Next.js Image для текстур:

```tsx
import Image from 'next/image'

// Для текстур используйте next/image с оптимизацией
```

### 3. Настройка next.config.ts

**Решение:** Добавьте оптимизации:

```tsx
// next.config.ts
const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Оптимизация бандла
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    }
    return config
  },
}
```

### 4. Использование React Server Components где возможно

**Решение:** Разделите клиентские и серверные компоненты:

```tsx
// Серверный компонент (по умолчанию)
export default function GameLayout({ children }) {
  return <div>{children}</div>
}

// Клиентский компонент (только для 3D)
"use client"
export function OfficeScene() {
  // ...
}
```

---

## Оптимизация рендеринга

### 1. Оптимизация теней

**Проблема:** В `office-scene.tsx` `shadow-mapSize={[512,512]}` слишком маленький, но может быть избыточным.

**Решение:**

```tsx
<directionalLight
  position={[5, 7, 0]}
  intensity={1.5}
  shadow-mapSize={[1024, 1024]} // Увеличить для качества
  shadow-camera-far={50}
  shadow-camera-left={-20}
  shadow-camera-right={20}
  shadow-camera-top={20}
  shadow-camera-bottom={-20}
  castShadow
/>

// Отключить тени для мелких объектов
<mesh receiveShadow={false} castShadow={false}>
```

### 2. Использование LOD (Level of Detail)

**Решение:** Создайте компонент LOD:

```tsx
import { LOD } from 'three'

const LODModel = ({ position, highDetail, lowDetail }) => {
  const lodRef = useRef()
  
  useFrame(({ camera }) => {
    if (lodRef.current) {
      lodRef.current.update(camera)
    }
  })
  
  return (
    <LOD ref={lodRef}>
      <primitive object={highDetail} levels={[0, 50]} />
      <primitive object={lowDetail} levels={[50, 100]} />
    </LOD>
  )
}
```

### 3. Frustum Culling

**Решение:** React Three Fiber автоматически использует frustum culling, но можно оптилизировать:

```tsx
// Используйте useThree для получения камеры
import { useThree } from '@react-three/fiber'

const CulledObject = ({ position }) => {
  const { camera } = useThree()
  const [visible, setVisible] = useState(true)
  
  useFrame(() => {
    // Проверка видимости
    const distance = camera.position.distanceTo(new Vector3(...position))
    setVisible(distance < 50) // Показывать только близкие объекты
  })
  
  if (!visible) return null
  return <mesh position={position}>...</mesh>
}
```

### 4. Оптимизация освещения

**Решение:**

```tsx
// Используйте меньше источников света
<ambientLight intensity={0.8} />
<directionalLight intensity={1.5} castShadow />

// Отключите ненужные источники
// Удалите лишние pointLight, spotLight
```

---

## Управление памятью

### 1. Очистка ресурсов при размонтировании

**Решение:** Используйте `useEffect` для cleanup:

```tsx
useEffect(() => {
  return () => {
    // Очистка при размонтировании
    // useGLTF.clear('/model/furniture/model.glb') // Если нужно
  }
}, [])
```

### 2. Оптимизация геометрии

**Проблема:** В `curve-wall-object.tsx` геометрия создается каждый раз.

**Решение:** Кешируйте геометрию:

```tsx
// Создайте глобальный кеш
const geometryCache = new Map()

const getCachedGeometry = (key, factory) => {
  if (!geometryCache.has(key)) {
    geometryCache.set(key, factory())
  }
  return geometryCache.get(key)
}
```

### 3. Disposal паттерн

**Решение:** Явно освобождайте память:

```tsx
useEffect(() => {
  return () => {
    // Освобождение геометрии
    geometry.dispose()
    material.dispose()
    texture.dispose()
  }
}, [])
```

---

## Оптимизация состояния (Zustand)

### 1. Селекторы для подписок

**Проблема:** Компоненты подписываются на весь стор.

**Решение:** Используйте селекторы:

```tsx
// Плохо
const { playerPosition, activeNPC } = useGameStore()

// Хорошо
const playerPosition = useGameStore(state => state.playerPosition)
const activeNPC = useGameStore(state => state.activeNPC)
```

### 2. Разделение сторов

**Решение:** Разделите большой стор на несколько:

```tsx
// Вместо одного большого стора
// Создайте отдельные:
// - usePlayerStore
// - useNPCStore
// - useMissionStore
```

### 3. Мемоизация действий

**Решение:**

```tsx
const setPlayerPosition = useGameStore(
  state => state.setPlayerPosition,
  shallow // Для сравнения
)
```

---

## Структура кода

### 1. Вынос конфигураций

**Проблема:** Большие массивы конфигураций в компонентах.

**Решение:** Вынесите в отдельные файлы:

```tsx
// src/shared/config/office-scene-config.ts
export const TABLE_POSITIONS = [...]
export const WALL_POSITIONS = [...]
export const WINDOW_POSITIONS = [...]
```

### 2. Создание переиспользуемых компонентов

**Решение:** Создайте компоненты-обертки:

```tsx
// src/entities/objects/ui/instanced-object.tsx
export const InstancedObject = ({ 
  modelPath, 
  instances 
}) => {
  // Логика инстансинга
}
```

### 3. Использование хуков для логики

**Решение:** Вынесите логику в хуки:

```tsx
// src/hooks/useSceneObjects.ts
export const useSceneObjects = (config) => {
  return useMemo(() => {
    // Логика создания объектов
  }, [config])
}
```

---

## Чеклист оптимизации

### Критичные (сделать в первую очередь):
- [ ] Использовать `InstancedMesh` для повторяющихся объектов
- [ ] Оптимизировать предзагрузку моделей (ленивая загрузка)
- [ ] Использовать `Clone` вместо повторной загрузки
- [ ] Оптимизировать коллайдеры (объединить где возможно)
- [ ] Code splitting для сцен (dynamic import)

### Важные (следующий этап):
- [ ] Добавить LOD для сложных моделей
- [ ] Оптимизировать настройки Canvas
- [ ] Использовать React.memo для компонентов
- [ ] Оптимизировать освещение и тени
- [ ] Разделить Zustand сторы

### Желательные (для дальнейшего улучшения):
- [ ] Сжать GLB файлы (Draco)
- [ ] Добавить frustum culling для дальних объектов
- [ ] Оптимизировать текстуры (WebP)
- [ ] Добавить cleanup для ресурсов
- [ ] Вынести конфигурации в отдельные файлы

---

## Измерение производительности

### Инструменты для профилирования:

1. **React DevTools Profiler** - для React компонентов
2. **Chrome DevTools Performance** - для общего профилирования
3. **Three.js Stats** - для FPS и памяти:

```tsx
import { Stats } from '@react-three/drei'

<Canvas>
  <Stats />
  {/* ... */}
</Canvas>
```

4. **Rapier Debug Renderer** (только для разработки):

```tsx
import { Debug } from '@react-three/rapier'

<Physics>
  <Debug />
  {/* ... */}
</Physics>
```

---

## Рекомендуемый порядок внедрения

1. **Неделя 1:** Оптимизация моделей (InstancedMesh, Clone)
2. **Неделя 2:** Оптимизация физики и коллайдеров
3. **Неделя 3:** Code splitting и Next.js оптимизации
4. **Неделя 4:** Рендеринг оптимизации (LOD, тени, освещение)
5. **Неделя 5:** Управление памятью и cleanup

---

## Дополнительные ресурсы

- [React Three Fiber Performance](https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance)
- [Three.js Optimization](https://threejs.org/manual/#en/fundamentals)
- [Rapier Performance](https://rapier.rs/docs/user_guides/javascript/performance)
- [Next.js Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)

---

**Примечание:** Все оптимизации должны тестироваться на реальных устройствах. Некоторые оптимизации могут ухудшить качество визуализации - найдите баланс между производительностью и качеством.

