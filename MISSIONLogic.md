# Mission Logic System - Полное руководство

## Введение

В этом документе описана архитектура системы выполнения миссий на примере поиска предмета. Система использует:
- **Zustand** для управления состоянием
- **React hooks** для отслеживания игровых событий
- **Three.js/R3F** для интерактивных объектов в 3D сцене

---

## 1. Архитектура системы

### 1.1 State Structure

```typescript
// Текущая структура в mission-store.ts
interface Mission {
  id: number;
  title: string;
  description: string;
  reward: number;
  progress: number;        // 0-100%
  completed: boolean;      // true когда progress >= 100
  type: string;           // 'main' | 'side'
  difficulty: string;     // 'easy' | 'medium' | 'hard'
  requires: number | null;
  relatedNPC?: number;
  objectives?: MissionObjective[];  // ← НОВОЕ: для отслеживания этапов
}

interface MissionObjective {
  id: string;
  description: string;
  completed: boolean;
  type: 'collect' | 'interact' | 'kill' | 'reach';
  itemId?: string;
  itemName?: string;
  count?: number;  // сколько нужно собрать
  collected?: number;  // сколько собрано
}
```

### 1.2 Хранилище (Mission Store)

```typescript
interface MissionStore {
  missions: Mission[];
  availableMission: Mission[];
  
  // Основные методы
  updateMissionProgress: (missionId: number, progress: number) => void;
  completeMission: (missionId: number) => void;
  assignMission: (missionId: number) => void;
  
  // НОВЫЕ методы для выполнения задач
  completeObjective: (missionId: number, objectiveId: string) => void;
  collectItem: (missionId: number, itemId: string, count: number) => void;
  checkMissionCompletion: (missionId: number) => boolean;
}
```

---

## 2. Пример: Миссия "Найти документ"

### 2.1 Определение миссии

```typescript
// shared/constants/missions.ts

export const MOCK_MISSIONS: Mission[] = [
  {
    id: 1,
    title: "Найти утерянный документ",
    description: "Найдите документ, который я потерял в офисе",
    reward: 100,
    progress: 0,
    completed: false,
    type: "main",
    difficulty: "easy",
    requires: null,
    relatedNPC: 1,  // NPC 1 выдаёт эту миссию
    objectives: [
      {
        id: "doc_find",
        description: "Найти документ на столе",
        completed: false,
        type: "collect",
        itemId: "document_001",
        itemName: "Важный документ",
        count: 1,
        collected: 0,
      },
      {
        id: "doc_deliver",
        description: "Отнести документ NPC",
        completed: false,
        type: "interact",
      }
    ]
  }
];
```

---

## 3. Система сбора предметов

### 3.1 Интерактивный объект в 3D сцене

```typescript
// entities/objects/ui/collectible-object.tsx

import { useFrame } from '@react-three/fiber';
import { useState } from 'react';
import { useMissionStore } from '@/widgets/store/mission-store';

interface CollectibleObjectProps {
  id: string;
  itemName: string;
  position: [number, number, number];
  missionId: number;
  objectiveId: string;
}

export function CollectibleObject({
  id,
  itemName,
  position,
  missionId,
  objectiveId,
}: CollectibleObjectProps) {
  const [isHovered, setIsHovered] = useState(false);
  const collectItem = useMissionStore((state) => state.collectItem);
  const missions = useMissionStore((state) => state.missions);
  
  // Проверяем, активна ли миссия и не собран ли уже предмет
  const mission = missions.find(m => m.id === missionId);
  const objective = mission?.objectives?.find(o => o.id === objectiveId);
  const isCollected = objective?.completed;

  const handleCollect = () => {
    if (!isCollected) {
      // Вызываем функцию сбора предмета
      collectItem(missionId, id, 1);
      
      console.log(`✅ Предмет собран: ${itemName}`);
    }
  };

  return (
    <group position={position}>
      {/* 3D модель предмета */}
      <mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onClick={handleCollect}
      >
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial
          color={isHovered && !isCollected ? '#FFD700' : '#CCCCCC'}
          emissive={isHovered && !isCollected ? '#FFD700' : '#000000'}
          emissiveIntensity={isHovered && !isCollected ? 0.5 : 0}
        />
      </mesh>

      {/* Подсказка при наведении */}
      {isHovered && !isCollected && (
        <Html position={[0, 0.3, 0]} center>
          <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs whitespace-nowrap">
            Нажми для сбора: {itemName}
          </div>
        </Html>
      )}

      {/* Визуальный индикатор собранного предмета */}
      {isCollected && (
        <meshStandardMaterial
          color="#00AA00"
          opacity={0.3}
          transparent
        />
      )}
    </group>
  );
}
```

---

## 4. Обновление Mission Store

### 4.1 Новые методы в mission-store.ts

```typescript
export const useMissionStore = create<MissionStore>()(
  persist(
    (set, get) => ({
      // ... существующий код ...

      // НОВЫЙ метод: собрать предмет
      collectItem: (missionId: number, itemId: string, count: number) => {
        set((state) => ({
          missions: state.missions.map((mission) => {
            if (mission.id !== missionId) return mission;

            // Обновляем objective (этап миссии)
            const updatedObjectives = mission.objectives?.map((obj) => {
              if (obj.type === 'collect' && obj.itemId === itemId) {
                const newCollected = (obj.collected || 0) + count;
                const targetCount = obj.count || 1;
                
                return {
                  ...obj,
                  collected: newCollected,
                  completed: newCollected >= targetCount, // Этап завершён?
                };
              }
              return obj;
            }) || [];

            // Вычисляем общий прогресс
            const completedObjectives = updatedObjectives.filter(o => o.completed).length;
            const totalObjectives = updatedObjectives.length;
            const newProgress = Math.round(
              (completedObjectives / totalObjectives) * 100
            );

            return {
              ...mission,
              objectives: updatedObjectives,
              progress: newProgress,
              completed: newProgress >= 100, // Миссия завершена?
            };
          }),
        }));
      },

      // НОВЫЙ метод: завершить этап миссии
      completeObjective: (missionId: number, objectiveId: string) => {
        set((state) => ({
          missions: state.missions.map((mission) => {
            if (mission.id !== missionId) return mission;

            const updatedObjectives = mission.objectives?.map((obj) => {
              if (obj.id === objectiveId) {
                return { ...obj, completed: true };
              }
              return obj;
            }) || [];

            const completedObjectives = updatedObjectives.filter(o => o.completed).length;
            const totalObjectives = updatedObjectives.length;
            const newProgress = Math.round(
              (completedObjectives / totalObjectives) * 100
            );

            return {
              ...mission,
              objectives: updatedObjectives,
              progress: newProgress,
              completed: newProgress >= 100,
            };
          }),
        }));
      },

      // НОВЫЙ метод: проверить завершение миссии
      checkMissionCompletion: (missionId: number): boolean => {
        const mission = get().missions.find(m => m.id === missionId);
        if (!mission) return false;
        
        const allCompleted = mission.objectives?.every(o => o.completed) ?? true;
        return allCompleted && mission.progress >= 100;
      },

      // Обновляем completeMission для добавления награды
      completeMission: (missionId: number) => {
        set((state) => ({
          missions: state.missions.map((mission) => {
            if (mission.id === missionId) {
              return {
                ...mission,
                progress: 100,
                completed: true,
                objectives: mission.objectives?.map(obj => ({
                  ...obj,
                  completed: true,
                })) || [],
              };
            }
            return mission;
          }),
        }));

        const mission = get().missions.find(m => m.id === missionId);
        if (mission) {
          console.log(`✅ Миссия завершена: ${mission.title}`);
          console.log(`🎁 Награда: +${mission.reward} XP`);
        }
      },
    }),
    { name: 'mission-storage' }
  )
);
```

---

## 5. Интеграция с игровой сценой

### 5.1 Добавление интерактивного объекта в сцену

```typescript
// entities/scene/ui/office-scene.tsx

import { CollectibleObject } from '@/entities/objects/ui/collectible-object';
import { useMissionStore } from '@/widgets/store/mission-store';

export function OfficeScene() {
  const missions = useMissionStore((state) => state.missions);
  
  // Находим активную миссию с целью сбора
  const activeMissions = missions.filter(m => !m.completed);

  return (
    <Canvas>
      {/* ... остальная сцена ... */}

      {/* Интерактивные объекты для миссий */}
      {activeMissions.map((mission) =>
        mission.objectives?.map((objective) => {
          if (objective.type === 'collect' && !objective.completed) {
            return (
              <CollectibleObject
                key={`${mission.id}-${objective.id}`}
                id={objective.itemId || ''}
                itemName={objective.itemName || ''}
                position={[3.5, 1, 0]}  // Позиция на столе
                missionId={mission.id}
                objectiveId={objective.id}
              />
            );
          }
          return null;
        })
      )}
    </Canvas>
  );
}
```

---

## 6. UI для отслеживания миссии

### 6.1 Компонент отслеживания этапов

```typescript
// features/missions/ui/mission-tracker.tsx

import { useMissionStore } from '@/widgets/store/mission-store';

interface MissionTrackerProps {
  missionId: number;
}

export function MissionTracker({ missionId }: MissionTrackerProps) {
  const missions = useMissionStore((state) => state.missions);
  const mission = missions.find(m => m.id === missionId);

  if (!mission) return null;

  return (
    <div className="bg-black/70 border border-yellow-500 rounded-lg p-4">
      {/* Название миссии */}
      <h3 className="text-yellow-200 font-bold mb-3">{mission.title}</h3>

      {/* Прогресс миссии */}
      <div className="mb-4">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              mission.completed ? 'bg-green-400' : 'bg-yellow-400'
            }`}
            style={{ width: `${mission.progress}%` }}
          />
        </div>
        <p className="text-yellow-500 text-sm mt-2">{mission.progress}%</p>
      </div>

      {/* Этапы миссии */}
      <div className="space-y-2">
        <h4 className="text-yellow-500/70 text-xs uppercase">Этапы:</h4>
        {mission.objectives?.map((objective) => (
          <div key={objective.id} className="flex items-center gap-2">
            {/* Чекбокс */}
            <div
              className={`w-4 h-4 rounded border ${
                objective.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-yellow-500'
              }`}
            >
              {objective.completed && (
                <span className="text-white text-xs">✓</span>
              )}
            </div>

            {/* Описание этапа */}
            <span
              className={`text-sm ${
                objective.completed
                  ? 'text-yellow-500/50 line-through'
                  : 'text-yellow-200'
              }`}
            >
              {objective.description}
            </span>

            {/* Счётчик для сбора */}
            {objective.type === 'collect' && (
              <span className="text-yellow-500 text-xs ml-auto">
                {objective.collected}/{objective.count}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Статус */}
      <div className="mt-4 pt-4 border-t border-yellow-500/30">
        <p className="text-yellow-500">
          {mission.completed ? (
            <span className="text-green-400">✅ Миссия завершена!</span>
          ) : (
            <span>⏳ {mission.progress}% завершено</span>
          )}
        </p>
      </div>
    </div>
  );
}
```

---

## 7. Полный поток выполнения

### 7.1 Пошаговый процесс

```
1. Игрок берёт миссию у NPC
   ↓
2. useMissionStore.assignMission(1)
   - Миссия переходит из availableMission в missions
   - objectives инициализируются с completed: false
   ↓
3. Игрок видит в HUD: "Найти документ" (0%)
   ↓
4. Игрок кликает на предмет в сцене
   ↓
5. CollectibleObject.onClick() вызывает collectItem()
   ↓
6. useMissionStore.collectItem(1, 'document_001', 1)
   - objectives[0].collected становится 1
   - objectives[0].completed становится true
   - progress вычисляется: 1/2 = 50%
   ↓
7. MissionTracker отображает: "50% завершено"
   - Этап 1 получает ✓
   ↓
8. Игрок идёт к NPC и кликает на него
   ↓
9. NPC диалог срабатывает, вызывает completeMission(1)
   ↓
10. useMissionStore.completeMission(1)
    - progress = 100%
    - completed = true
    - все objectives = true
    ↓
11. UI показывает: "✅ Миссия завершена!"
    - Игрок получает 100 XP
    - Миссия перемещается в "Выполненные"
```

---

## 8. Различные типы целей

### 8.1 Примеры разных типов objective

```typescript
// Тип: сбор предметов (collect)
{
  id: "coins_collect",
  description: "Собрать 5 монет",
  type: "collect",
  itemId: "coin",
  itemName: "Золотая монета",
  count: 5,
  collected: 0,
  completed: false,
}

// Тип: взаимодействие (interact)
{
  id: "door_open",
  description: "Открыть дверь в офис",
  type: "interact",
  completed: false,
}

// Тип: убить врага (kill)
{
  id: "enemy_defeat",
  description: "Победить 3 противника",
  type: "kill",
  count: 3,
  completed: 0,
  completed: false,
}

// Тип: дойти до места (reach)
{
  id: "reach_location",
  description: "Дойти до 5 этажа",
  type: "reach",
  locationId: "floor_5",
  completed: false,
}
```

### 8.2 Обработка разных типов

```typescript
// Для 'interact'
handleDoorInteraction = () => {
  completeObjective(missionId, 'door_open');
};

// Для 'reach'
useEffect(() => {
  const position = characterPos;
  const targetPosition = locationMap['floor_5'];
  
  if (distance(position, targetPosition) < 1) {
    completeObjective(missionId, 'reach_location');
  }
}, [characterPos]);

// Для 'kill'
handleEnemyDefeat = (enemyId) => {
  const killObjective = mission.objectives?.find(o => o.type === 'kill');
  if (killObjective) {
    collectItem(missionId, enemyId, 1); // Используем как счётчик
  }
};
```

---

## 9. Продвинутые функции

### 9.1 Логирование миссий

```typescript
// widgets/store/mission-store.ts

// Добавить в collectItem
if (newCollected === targetCount) {
  console.log(`✅ Этап завершен: ${objective.description}`);
}

// Добавить в completeMission
const authStore = useAuthStore.getState();
console.log(`
  🎮 Миссия завершена
  📜 Название: ${mission.title}
  👤 Игрок: ${authStore.user?.name}
  🎁 Награда: +${mission.reward} XP
  ⏱️ Время: ${new Date().toLocaleTimeString()}
`);
```

### 9.2 Условные миссии (требования)

```typescript
// Миссия 5 требует завершения миссии 3
{
  id: 5,
  title: "Сложная задача",
  requires: 3,  // Нужно сначала завершить миссию 3
}

// Проверка в NPC диалоге
const canAssignMission = (mission) => {
  if (!mission.requires) return true;
  
  const requiredMission = missions.find(m => m.id === mission.requires);
  return requiredMission?.completed || false;
};
```

---

## 10. Тестирование

### 10.1 Проверка логики

```typescript
// Сценарий 1: Сбор одного предмета
1. assignMission(1)
2. collectItem(1, 'document_001', 1)
   ✓ objectives[0].collected === 1
   ✓ objectives[0].completed === true
   ✓ progress === 50

// Сценарий 2: Завершение миссии
1. assignMission(1)
2. completeObjective(1, 'doc_find')
3. completeObjective(1, 'doc_deliver')
   ✓ progress === 100
   ✓ completed === true

// Сценарий 3: Новый игрок
1. resetCookie()
   ✓ missions === []
   ✓ availableMission === [15 миссий]
   ✓ Все миссии имеют objectives
```

---

## 11. Структура файлов

```
src/
├── shared/
│   ├── constants/
│   │   └── missions.ts          ← Определение всех миссий
│   ├── types/
│   │   └── missionType.ts       ← Interface Mission, MissionObjective
│
├── entities/
│   └── objects/
│       └── ui/
│           └── collectible-object.tsx  ← Интерактивный предмет
│
├── widgets/
│   ├── store/
│   │   └── mission-store.ts     ← Логика миссий (Zustand)
│   └── game-hud/
│       └── ui/
│           ├── game-hud.tsx     ← Отображение активных миссий
│           └── npc-mission-dialog.tsx
│
└── features/
    └── missions/
        └── ui/
            ├── missions-content.tsx     ← Список всех миссий
            └── mission-tracker.tsx      ← Трекер этапов
```

---

## Заключение

Эта система позволяет:

✅ **Гибко создавать миссии** с разными типами целей  
✅ **Отслеживать прогресс** в реальном времени  
✅ **Взаимодействовать** с 3D объектами  
✅ **Видеть статус** миссии в UI  
✅ **Получать награды** при завершении  

Все хранится в **Zustand**, что обеспечивает оптимальную производительность и простоту отладки.
