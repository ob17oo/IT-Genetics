# 🎯 Руководство по оптимизации сцены: Разбиение офиса на зоны

## 📋 Принципы разбиения

### 1. **Зонирование по логическим областям**
Разбиваем офис на зоны (комнаты, секции), каждая зона:
- Имеет границы (bounding box)
- Рендерится только когда игрок рядом
- Может иметь свой LOD (Level of Detail)

### 2. **Frustum Culling**
Three.js автоматически не рендерит объекты вне камеры, но мы можем помочь:
- Группировать объекты в зоны
- Отключать зоны, которые точно не видны

### 3. **Distance-based Visibility**
Показывать/скрывать зоны в зависимости от расстояния до игрока:
- **Близко (0-10м)**: Полная детализация
- **Средне (10-20м)**: Упрощенные модели
- **Далеко (20м+)**: Скрыто или только коллайдеры

---

## 🏗️ Структура файлов

```
entities/
  scene/
    model/
      scene-zones.ts          # Конфигурация зон
      zone-config.ts          # Типы и интерфейсы
    ui/
      office-scene.tsx        # Главная сцена
      office-zone.tsx         # Компонент зоны
      office-zone-manager.tsx # Менеджер зон (видимость)
```

---

## 💻 Реализация

### Шаг 1: Определение зон

Создай файл `src/entities/scene/model/scene-zones.ts`:

```typescript
import { Vector3 } from 'three'

export interface ZoneConfig {
  id: string
  name: string
  center: [number, number, number]  // Центр зоны
  size: [number, number, number]    // Размер bounding box
  renderDistance: number            // Расстояние, на котором показывать
  lodDistance?: number              // Расстояние для LOD
  objects: ZoneObject[]             // Объекты в зоне
}

export interface ZoneObject {
  type: 'table' | 'wall' | 'furniture'
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

// Конфигурация зон для офиса
export const OFFICE_ZONES: ZoneConfig[] = [
  {
    id: 'zone-front',
    name: 'Передняя секция',
    center: [0, 0, 14],
    size: [20, 10, 8],
    renderDistance: 25,
    objects: [
      { type: 'table', position: [-13, 0, 14] },
      { type: 'table', position: [-7, 0, 14] },
      { type: 'table', position: [-1, 0, 14] },
    ]
  },
  {
    id: 'zone-middle',
    name: 'Центральная секция',
    center: [0, 0, 4],
    size: [20, 10, 8],
    renderDistance: 25,
    objects: [
      { type: 'table', position: [-13, 0, 4] },
      { type: 'table', position: [-7, 0, 4] },
      { type: 'table', position: [-1, 0, 4] },
    ]
  },
  {
    id: 'zone-back',
    name: 'Задняя секция',
    center: [0, 0, -6],
    size: [20, 10, 8],
    renderDistance: 25,
    objects: [
      { type: 'table', position: [-13, 0, -6] },
      { type: 'table', position: [-7, 0, -6] },
      { type: 'table', position: [-1, 0, -6] },
    ]
  },
  {
    id: 'zone-walls',
    name: 'Стены',
    center: [0, 4, 0],
    size: [40, 10, 40],
    renderDistance: 50, // Стены всегда видны
    objects: [
      { type: 'wall', position: [15, 4, 0] },
      { type: 'wall', position: [-20, 4, 0] },
      { type: 'wall', position: [0, 4, -20] },
      { type: 'wall', position: [-7.6, 4, 20] },
    ]
  }
]
```

### Шаг 2: Хук для определения видимости зон

Создай `src/shared/hooks/use-zone-visibility.ts`:

```typescript
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Vector3 } from 'three'
import type { ZoneConfig } from '@/entities/scene/model/scene-zones'

interface ZoneVisibility {
  [zoneId: string]: boolean
}

export function useZoneVisibility(
  zones: ZoneConfig[],
  playerPosition: Vector3,
  updateInterval: number = 10 // Обновлять каждые 10 кадров
) {
  const [visibleZones, setVisibleZones] = useState<ZoneVisibility>({})
  const frameCount = useRef(0)

  useFrame(() => {
    frameCount.current++
    
    // Обновляем видимость не каждый кадр, а периодически
    if (frameCount.current % updateInterval !== 0) return

    const newVisibility: ZoneVisibility = {}

    zones.forEach((zone) => {
      const zoneCenter = new Vector3(...zone.center)
      const distance = playerPosition.distanceTo(zoneCenter)
      
      // Зона видима, если игрок в пределах renderDistance
      newVisibility[zone.id] = distance <= zone.renderDistance
    })

    setVisibleZones(newVisibility)
  })

  return visibleZones
}
```

### Шаг 3: Компонент зоны

Создай `src/entities/scene/ui/office-zone.tsx`:

```typescript
'use client'

import { RigidBody, MeshCollider } from '@react-three/rapier'
import { TableObject } from '@/entities/objects/ui/table-object'
import type { ZoneConfig } from '../model/scene-zones'

interface OfficeZoneProps {
  zone: ZoneConfig
  isVisible: boolean
  lod?: 'high' | 'medium' | 'low'
}

export function OfficeZone({ zone, isVisible, lod = 'high' }: OfficeZoneProps) {
  // Не рендерим, если зона не видима
  if (!isVisible) return null

  return (
    <group name={zone.id}>
      {zone.objects.map((obj, index) => {
        // Для LOD можно использовать упрощенные версии
        if (lod === 'low' && obj.type === 'table') {
          // Упрощенная версия стола (только коллайдер)
          return (
            <RigidBody key={index} type="fixed">
              <MeshCollider type="cuboid">
                <mesh position={obj.position}>
                  <boxGeometry args={[6, 1, 3.5]} />
                  <meshStandardMaterial visible={false} />
                </mesh>
              </MeshCollider>
            </RigidBody>
          )
        }

        // Полная версия
        switch (obj.type) {
          case 'table':
            return (
              <RigidBody key={index} type="fixed">
                <MeshCollider type="trimesh">
                  <TableObject position={obj.position} />
                </MeshCollider>
              </RigidBody>
            )
          
          case 'wall':
            // Рендерим стены отдельно
            return null
          
          default:
            return null
        }
      })}
    </group>
  )
}
```

### Шаг 4: Менеджер зон

Создай `src/entities/scene/ui/office-zone-manager.tsx`:

```typescript
'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { OfficeZone } from './office-zone'
import { useZoneVisibility } from '@/shared/hooks/use-zone-visibility'
import { OFFICE_ZONES } from '../model/scene-zones'
import type { RigidApi } from '@/entities/characters/third-person-character/character-controller'

interface OfficeZoneManagerProps {
  playerRigidBody: React.RefObject<{ translation: () => { x: number; y: number; z: number } } | null>
}

export function OfficeZoneManager({ playerRigidBody }: OfficeZoneManagerProps) {
  const playerPosition = useRef(new Vector3(0, 0, 0))

  // Получаем позицию игрока
  useFrame(() => {
    if (playerRigidBody.current) {
      const t = playerRigidBody.current.translation()
      playerPosition.current.set(t.x, t.y, t.z)
    }
  })

  // Определяем видимость зон
  const visibleZones = useZoneVisibility(OFFICE_ZONES, playerPosition.current)

  return (
    <>
      {OFFICE_ZONES.map((zone) => (
        <OfficeZone
          key={zone.id}
          zone={zone}
          isVisible={visibleZones[zone.id] ?? false}
        />
      ))}
    </>
  )
}
```

### Шаг 5: Обновленная главная сцена

Обнови `src/entities/scene/ui/office-scene.tsx`:

```typescript
'use client'
import { TableObject } from "@/entities/objects/ui/table-object";
import { Canvas } from "@react-three/fiber";
import "@/shared/lib/preload-models";
import GameHud from "@/widgets/game-hud/ui/game-hud";
import { CharacterController } from "@/entities/characters/third-person-character/character-controller";
import { Physics, RigidBody, CuboidCollider, MeshCollider } from "@react-three/rapier";
import { Suspense, useRef } from "react";
import SceneLoader from "@/shared/ui/Loader/scene-loader";
import FloorTexture from '../../textures/floor-texture'
import { OfficeZoneManager } from './office-zone-manager'

export function OfficeScene() {
  // Реф для доступа к rigid body игрока
  const playerRbRef = useRef<{ translation: () => { x: number; y: number; z: number } } | null>(null)

  return (
    <section className="w-full h-screen relative">
      <SceneLoader />
      <Canvas shadows camera={{ position: [0, 1.7, 10], fov: 75 }}>
        <Suspense fallback={null}>
          <Physics gravity={[0, -20, 0]}>
            <color attach="background" args={["#1E1E1E"]} />

            <ambientLight intensity={1} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.5}
              castShadow
            />

            {/* Пол (всегда видим) */}
            <RigidBody type="fixed">
              <FloorTexture />
              <CuboidCollider args={[20, 0.1, 40]} position={[0, -1, 0]} />
            </RigidBody>

            {/* Стены (всегда видимы, но можно оптимизировать) */}
            <RigidBody type="fixed">
              <mesh rotation={[0, 0, 0]} position={[15, 4, 0]} receiveShadow>
                <boxGeometry args={[0.3, 10, 40]} />
                <meshStandardMaterial color="#FFFFFF" />
              </mesh>
              <CuboidCollider args={[0.15, 5, 20]} position={[15, 4, 0]} />
            </RigidBody>
            {/* ... остальные стены ... */}

            {/* Зоны с мебелью (рендерятся по видимости) */}
            <OfficeZoneManager playerRigidBody={playerRbRef} />

            {/* Игрок */}
            <CharacterController ref={playerRbRef} />
          </Physics>
        </Suspense>
      </Canvas>
      <GameHud />
    </section>
  );
}
```

### Шаг 6: Обновление CharacterController

Нужно экспортировать ref из CharacterController:

```typescript
// В character-controller.tsx
export const CharacterController = forwardRef<RigidApi, {}>((props, ref) => {
  const rb = useRef<RigidApi | null>(null);
  
  // Передаем ref наружу
  useImperativeHandle(ref, () => rb.current!, []);
  
  // ... остальной код
})
```

---

## 🚀 Дополнительные оптимизации

### 1. **Инстансирование для повторяющихся объектов**

```typescript
import { Instances, Instance } from '@react-three/drei'

// Вместо 9 отдельных TableObject
<Instances limit={9} range={9}>
  <tableGeometry />
  <meshStandardMaterial color="#DED1B6" />
  {tablePositions.map((pos, i) => (
    <Instance key={i} position={pos} />
  ))}
</Instances>
```

### 2. **Geometry Merging для статичных объектов**

```typescript
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'

// Объединить все стены в один меш
const wallGeometries = walls.map(wall => {
  const geo = new BoxGeometry(...wall.size)
  geo.translate(...wall.position)
  return geo
})
const mergedWalls = mergeGeometries(wallGeometries)
```

### 3. **LOD (Level of Detail)**

```typescript
import { LOD } from 'three'

<LOD>
  {/* Высокая детализация (близко) */}
  <mesh geometry={highDetailGeo} position={[0, 0, 0]}>
    <meshStandardMaterial />
  </mesh>
  
  {/* Средняя детализация (дальше) */}
  <mesh geometry={mediumDetailGeo} position={[0, 0, 0]}>
    <meshStandardMaterial />
  </mesh>
  
  {/* Низкая детализация (очень далеко) */}
  <mesh geometry={lowDetailGeo} position={[0, 0, 0]}>
    <meshStandardMaterial />
  </mesh>
</LOD>
```

### 4. **Frustum Culling с ручной проверкой**

```typescript
import { Frustum, Matrix4 } from 'three'

const frustum = new Frustum()
const matrix = new Matrix4()

useFrame(({ camera }) => {
  matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
  frustum.setFromProjectionMatrix(matrix)
  
  zones.forEach(zone => {
    const isInFrustum = frustum.containsPoint(new Vector3(...zone.center))
    // Показывать только если в frustum
  })
})
```

---

## 📊 Ожидаемые результаты

| Метрика | До оптимизации | После оптимизации |
|---------|----------------|-------------------|
| Draw calls | ~50+ | ~15-20 |
| FPS (средний) | 30-40 | 55-60 |
| Память (GPU) | Высокая | Средняя |
| Время загрузки | Медленно | Быстро |

---

## ✅ Чеклист внедрения

- [ ] Создать конфигурацию зон (`scene-zones.ts`)
- [ ] Создать хук `useZoneVisibility`
- [ ] Создать компонент `OfficeZone`
- [ ] Создать `OfficeZoneManager`
- [ ] Обновить `OfficeScene` для использования зон
- [ ] Добавить ref в `CharacterController`
- [ ] Протестировать производительность
- [ ] Настроить расстояния видимости под свою сцену
- [ ] (Опционально) Добавить LOD
- [ ] (Опционально) Добавить инстансирование

---

## 🎯 Итоговые рекомендации

1. **Начни с простого**: Сначала разбей на зоны, потом добавляй LOD
2. **Тестируй производительность**: Используй `drei/Stats` или `drei/PerformanceMonitor`
3. **Настраивай расстояния**: Подбери `renderDistance` под размер твоей сцены
4. **Не переоптимизируй**: Если FPS уже 60, не нужно усложнять

**Главное правило**: Рендери только то, что видит игрок или может увидеть в ближайшее время.

