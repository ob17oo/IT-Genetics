# Улучшение FSD (Feature-Sliced Design) архитектуры

## 📋 Текущее состояние

### Структура проекта:
```
src/
├── app/              # Next.js App Router (правильно)
├── pages/            # Дублирование с app/ (проблема)
├── entities/         # Бизнес-сущности (частично правильно)
├── features/         # Фичи (неполная структура)
├── widgets/         # Виджеты (содержит stores - проблема)
├── shared/          # Общие ресурсы (правильно)
├── hooks/           # Хуки в корне (проблема)
└── processes/       # Пустая папка (не используется)
```

---

## 🔴 Критические проблемы

### 1. **Stores находятся в `widgets/store/`**

**Проблема:** Нарушение принципов FSD - stores должны быть в `features/*/model` или `shared/lib`.

**Текущая структура:**
```
widgets/
└── store/
    ├── auth-store.ts
    ├── game-store.ts
    ├── mission-store.ts
    ├── npc-interaction-store.ts
    └── achievments-mission.ts
```

**Почему это проблема:**
- Widgets не должны содержать бизнес-логику (stores)
- Нарушается правило зависимостей: `features` импортируют из `widgets`
- Сложно переиспользовать stores в других местах

**Решение:**
```
features/
├── auth/
│   └── model/
│       └── auth-store.ts
├── missions/
│   └── model/
│       └── mission-store.ts
├── npc-interaction/
│   └── model/
│       └── npc-interaction-store.ts
└── achievements/
    └── model/
        └── achievements-store.ts

shared/
└── lib/
    └── stores/
        └── game-store.ts  # Глобальное состояние игры
```

---

### 2. **Features используют stores из widgets**

**Проблема:** Нарушение правил зависимостей FSD.

**Текущий код:**
```tsx
// features/missions/ui/missions-content.tsx
import { useMissionStore } from "@/widgets/store/mission-store"; // ❌
```

**Правильно:**
```tsx
// features/missions/ui/missions-content.tsx
import { useMissionStore } from "@/features/missions/model/mission-store"; // ✅
```

---

### 3. **Дублирование Pages**

**Проблема:** Есть и `app/`, и `pages/` - дублирование функциональности.

**Текущая структура:**
```
app/
└── (main)/
    └── game/
        └── page.tsx  # Импортирует из pages/

pages/
└── game/
    └── ui/
        └── game-page.tsx
```

**Решение:** Удалить `pages/` и использовать только `app/` (Next.js App Router).

---

### 4. **Hooks в корне `src/hooks/`**

**Проблема:** Хуки должны быть в `shared/lib/hooks` или внутри features/widgets.

**Текущая структура:**
```
src/
└── hooks/
    ├── useCachedModel.tsx
    └── useNPCInteraction.tsx
```

**Решение:**
```
shared/
└── lib/
    └── hooks/
        ├── useCachedModel.tsx
        └── useNPCInteraction.tsx  # Или в features/npc-interaction/lib/
```

---

### 5. **Features не имеют полной структуры**

**Проблема:** Features не следуют полной структуре FSD.

**Текущая структура:**
```
features/
├── missions/
│   ├── model/      # Пустая папка
│   └── ui/
│       └── missions-content.tsx
└── shop/
    └── ui/
        └── shop-content.tsx
```

**Правильная структура:**
```
features/
├── missions/
│   ├── api/         # API запросы (если есть)
│   ├── lib/         # Утилиты и хелперы
│   ├── model/       # Stores, типы, бизнес-логика
│   ├── ui/          # UI компоненты
│   └── index.ts     # Публичный API
├── shop/
│   ├── api/
│   ├── lib/
│   ├── model/
│   ├── ui/
│   └── index.ts
└── achievements/
    ├── api/
    ├── lib/
    ├── model/
    ├── ui/
    └── index.ts
```

---

### 6. **Entities не имеют полной структуры**

**Проблема:** Entities смешивают UI и логику без разделения.

**Текущая структура:**
```
entities/
├── characters/
│   ├── lobby-npc/
│   │   └── lobby-npc.tsx
│   └── third-person-character/
│       ├── character-controller.tsx
│       └── character.tsx
└── objects/
    └── ui/
        └── *.tsx
```

**Правильная структура:**
```
entities/
├── character/
│   ├── lib/              # Утилиты для персонажей
│   ├── model/            # Типы, интерфейсы
│   ├── ui/               # UI компоненты
│   │   ├── lobby-npc/
│   │   │   └── lobby-npc.tsx
│   │   └── third-person-character/
│   │       ├── character-controller.tsx
│   │       └── character.tsx
│   └── index.ts          # Публичный API
├── object/
│   ├── lib/
│   ├── model/
│   ├── ui/
│   │   ├── admin-table/
│   │   ├── chair/
│   │   ├── window/
│   │   └── ...
│   └── index.ts
└── scene/
    ├── lib/
    ├── model/
    ├── ui/
    │   ├── lobby-scene.tsx
    │   └── office-scene.tsx
    └── index.ts
```

---

### 7. **Widgets содержат stores**

**Проблема:** Widgets не должны содержать бизнес-логику.

**Текущая структура:**
```
widgets/
├── game-hud/
│   └── ui/
│       └── game-hud.tsx  # Использует stores из widgets/store
└── store/                 # ❌ Не должно быть здесь
    └── *.ts
```

**Решение:** Убрать stores из widgets, использовать stores из features.

---

### 8. **Отсутствие Processes**

**Проблема:** Папка `processes/` пустая, но должна содержать сложные бизнес-процессы.

**Когда использовать processes:**
- Сложные сценарии, затрагивающие несколько features
- Оркестрация нескольких stores
- Сложная бизнес-логика

**Пример:**
```
processes/
└── mission-completion/
    ├── lib/
    │   └── complete-mission-flow.ts
    ├── model/
    │   └── mission-completion-store.ts
    └── ui/
        └── mission-completion-dialog.tsx
```

---

## ✅ Рекомендуемая структура

### Полная структура проекта:

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   ├── (main)/
│   ├── layout.tsx
│   └── providers/
│
├── entities/                     # Бизнес-сущности
│   ├── character/
│   │   ├── lib/
│   │   ├── model/
│   │   ├── ui/
│   │   └── index.ts
│   ├── object/
│   │   ├── lib/
│   │   ├── model/
│   │   ├── ui/
│   │   └── index.ts
│   └── scene/
│       ├── lib/
│       ├── model/
│       ├── ui/
│       └── index.ts
│
├── features/                     # Фичи
│   ├── auth/
│   │   ├── api/
│   │   ├── lib/
│   │   ├── model/
│   │   │   └── auth-store.ts
│   │   ├── ui/
│   │   └── index.ts
│   ├── missions/
│   │   ├── api/
│   │   ├── lib/
│   │   │   └── mission-helpers.ts
│   │   ├── model/
│   │   │   ├── mission-store.ts
│   │   │   └── mission-types.ts
│   │   ├── ui/
│   │   │   ├── missions-content.tsx
│   │   │   └── mission-card.tsx
│   │   └── index.ts
│   ├── achievements/
│   │   ├── model/
│   │   │   └── achievements-store.ts
│   │   ├── ui/
│   │   └── index.ts
│   ├── npc-interaction/
│   │   ├── lib/
│   │   │   └── useNPCInteraction.tsx
│   │   ├── model/
│   │   │   └── npc-interaction-store.ts
│   │   ├── ui/
│   │   └── index.ts
│   └── shop/
│       ├── model/
│       ├── ui/
│       └── index.ts
│
├── widgets/                      # Виджеты (композиция features)
│   ├── game-hud/
│   │   ├── lib/
│   │   ├── ui/
│   │   │   ├── game-hud.tsx
│   │   │   ├── mission-hud.tsx
│   │   │   └── game-dialog.tsx
│   │   └── index.ts
│   └── scene-loader/
│       ├── ui/
│       └── index.ts
│
├── shared/                       # Общие ресурсы
│   ├── api/                      # API клиенты, конфигурация
│   ├── config/                   # Конфигурации
│   │   └── office-scene-config.ts
│   ├── constants/                # Константы
│   ├── lib/                      # Утилиты
│   │   ├── hooks/
│   │   │   └── useCachedModel.tsx
│   │   ├── stores/
│   │   │   └── game-store.ts     # Глобальное состояние
│   │   └── preload-models.ts
│   ├── types/                    # Общие типы
│   └── ui/                        # UI киты
│       ├── buttons/
│       ├── input/
│       └── loader/
│
└── processes/                    # Сложные бизнес-процессы
    └── mission-completion/
        ├── lib/
        ├── model/
        └── ui/
```

---

## 🔧 Пошаговый план миграции

### Шаг 1: Переместить stores из widgets в features

```bash
# Создать структуру
mkdir -p src/features/auth/model
mkdir -p src/features/missions/model
mkdir -p src/features/npc-interaction/model
mkdir -p src/features/achievements/model
mkdir -p src/shared/lib/stores

# Переместить файлы
mv src/widgets/store/auth-store.ts src/features/auth/model/
mv src/widgets/store/mission-store.ts src/features/missions/model/
mv src/widgets/store/npc-interaction-store.ts src/features/npc-interaction/model/
mv src/widgets/store/achievments-mission.ts src/features/achievements/model/
mv src/widgets/store/game-store.ts src/shared/lib/stores/
```

### Шаг 2: Обновить импорты

**Было:**
```tsx
import { useMissionStore } from "@/widgets/store/mission-store";
```

**Стало:**
```tsx
import { useMissionStore } from "@/features/missions/model/mission-store";
```

**Файлы для обновления:**
- `src/features/missions/ui/missions-content.tsx`
- `src/widgets/game-hud/ui/game-hud.tsx`
- `src/widgets/game-hud/ui/npc-mission-dialog.tsx`
- `src/entities/scene/ui/office-scene.tsx`
- `src/entities/scene/ui/lobby-scene.tsx`

### Шаг 3: Переместить hooks

```bash
mkdir -p src/shared/lib/hooks
mv src/hooks/useCachedModel.tsx src/shared/lib/hooks/
mv src/hooks/useNPCInteraction.tsx src/features/npc-interaction/lib/
```

### Шаг 4: Удалить дублирование pages

```bash
# Удалить pages/, использовать только app/
rm -rf src/pages/

# Обновить app/(main)/game/page.tsx
# Импортировать напрямую из entities
```

### Шаг 5: Создать публичные API для features

```tsx
// features/missions/index.ts
export { MissionsContent } from './ui/missions-content';
export { useMissionStore } from './model/mission-store';
export type { Mission } from './model/mission-types';

// features/auth/index.ts
export { useAuthStore } from './model/auth-store';
export type { User } from './model/auth-types';
```

### Шаг 6: Реорганизовать entities

```bash
# Создать правильную структуру
mkdir -p src/entities/character/{lib,model,ui}
mkdir -p src/entities/object/{lib,model,ui}
mkdir -p src/entities/scene/{lib,model,ui}

# Переместить файлы
mv src/entities/characters/* src/entities/character/ui/
mv src/entities/objects/ui/* src/entities/object/ui/
mv src/entities/scene/ui/* src/entities/scene/ui/
```

### Шаг 7: Создать типы в model слоях

```tsx
// features/missions/model/mission-types.ts
export interface Mission {
  id: number;
  title: string;
  description: string;
  // ...
}

// entities/character/model/character-types.ts
export interface CharacterProps {
  position: [number, number, number];
  // ...
}
```

---

## 📝 Правила зависимостей FSD

### Правило импортов:

```
app → widgets → features → entities → shared
```

**Разрешено:**
- ✅ `features` импортирует из `entities` и `shared`
- ✅ `widgets` импортирует из `features`, `entities`, `shared`
- ✅ `app` импортирует из всех слоев

**Запрещено:**
- ❌ `entities` импортирует из `features`
- ❌ `shared` импортирует из других слоев
- ❌ `features` импортирует из `widgets`

### Примеры правильных импортов:

```tsx
// ✅ features/missions/ui/missions-content.tsx
import { useMissionStore } from '@/features/missions/model/mission-store'
import { Mission } from '@/shared/types/missionType'
import { Button } from '@/shared/ui/buttons'

// ✅ widgets/game-hud/ui/game-hud.tsx
import { useMissionStore } from '@/features/missions/model/mission-store'
import { useAuthStore } from '@/features/auth/model/auth-store'
import { Character } from '@/entities/character'

// ✅ app/(main)/game/page.tsx
import { OfficeScene } from '@/entities/scene'
import { GameHud } from '@/widgets/game-hud'
```

---

## 🎯 Улучшения для каждой фичи

### 1. Features/Missions

**Текущая структура:**
```
missions/
├── model/      # Пустая
└── ui/
    └── missions-content.tsx
```

**Рекомендуемая структура:**
```
missions/
├── api/                    # Если есть API
│   └── mission-api.ts
├── lib/                    # Утилиты
│   ├── mission-helpers.ts
│   └── mission-filters.ts
├── model/
│   ├── mission-store.ts
│   ├── mission-types.ts
│   └── mission-constants.ts
├── ui/
│   ├── missions-content.tsx
│   ├── mission-card.tsx
│   └── mission-filter.tsx
└── index.ts                # Публичный API
```

### 2. Features/Auth

**Создать:**
```
auth/
├── api/
│   └── auth-api.ts
├── lib/
│   └── auth-helpers.ts
├── model/
│   ├── auth-store.ts
│   └── auth-types.ts
├── ui/
│   ├── login-form.tsx
│   └── register-form.tsx
└── index.ts
```

### 3. Features/NPC-Interaction

**Создать:**
```
npc-interaction/
├── lib/
│   └── useNPCInteraction.tsx  # Переместить из hooks/
├── model/
│   ├── npc-interaction-store.ts
│   └── npc-types.ts
├── ui/
│   └── npc-dialog.tsx
└── index.ts
```

---

## 🔄 Рефакторинг entities

### Entities/Character

**Текущая структура:**
```
characters/
├── lobby-npc/
│   └── lobby-npc.tsx
└── third-person-character/
    ├── character-controller.tsx
    └── character.tsx
```

**Рекомендуемая структура:**
```
character/
├── lib/
│   ├── character-movement.ts
│   └── character-animations.ts
├── model/
│   ├── character-types.ts
│   └── character-constants.ts
├── ui/
│   ├── lobby-npc/
│   │   └── lobby-npc.tsx
│   └── third-person-character/
│       ├── character-controller.tsx
│       └── character.tsx
└── index.ts
```

### Entities/Object

**Текущая структура:**
```
objects/
└── ui/
    └── *.tsx  # Все объекты в одной папке
```

**Рекомендуемая структура:**
```
object/
├── lib/
│   ├── object-helpers.ts
│   └── object-cache.ts
├── model/
│   └── object-types.ts
├── ui/
│   ├── admin-table/
│   │   └── admin-table.tsx
│   ├── chair/
│   │   └── chair.tsx
│   ├── window/
│   │   ├── window-frame.tsx
│   │   └── instanced-window.tsx
│   └── ...
└── index.ts
```

---

## 📦 Создание публичных API

### Пример для features/missions:

```tsx
// features/missions/index.ts
export { MissionsContent } from './ui/missions-content';
export { MissionCard } from './ui/mission-card';
export { useMissionStore } from './model/mission-store';
export { filterMissions } from './lib/mission-filters';
export type { Mission, MissionType } from './model/mission-types';
```

### Пример для entities/character:

```tsx
// entities/character/index.ts
export { LobbyNPC } from './ui/lobby-npc/lobby-npc';
export { CharacterController } from './ui/third-person-character/character-controller';
export { Character } from './ui/third-person-character/character';
export type { CharacterProps } from './model/character-types';
```

### Использование:

```tsx
// ✅ Правильно - через публичный API
import { MissionsContent, useMissionStore } from '@/features/missions';
import { Character, LobbyNPC } from '@/entities/character';

// ❌ Неправильно - прямой импорт
import { MissionsContent } from '@/features/missions/ui/missions-content';
```

---

## 🚀 Дополнительные улучшения

### 1. Создать Processes для сложных сценариев

```tsx
// processes/mission-completion/lib/complete-mission-flow.ts
import { useMissionStore } from '@/features/missions';
import { useAchievementsStore } from '@/features/achievements';
import { useGameStore } from '@/shared/lib/stores/game-store';

export const completeMissionFlow = async (missionId: number) => {
  const mission = useMissionStore.getState().missions.find(m => m.id === missionId);
  if (!mission) return;
  
  // 1. Завершить миссию
  useMissionStore.getState().completeMission(missionId);
  
  // 2. Начислить награды
  const rewards = mission.reward;
  useGameStore.getState().addDNA(rewards);
  
  // 3. Проверить достижения
  useAchievementsStore.getState().checkAchievements();
  
  // 4. Показать уведомление
  // ...
};
```

### 2. Создать API слой

```tsx
// shared/api/config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// shared/api/client.ts
import axios from 'axios';
import { API_BASE_URL } from './config';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// features/missions/api/mission-api.ts
import { apiClient } from '@/shared/api/client';
import { Mission } from '../model/mission-types';

export const missionApi = {
  getMissions: () => apiClient.get<Mission[]>('/missions'),
  updateMission: (id: number, progress: number) => 
    apiClient.patch(`/missions/${id}`, { progress }),
};
```

### 3. Создать конфигурации для entities

```tsx
// entities/scene/model/scene-config.ts
export const SCENE_CONFIG = {
  office: {
    models: [...],
    physics: {...},
  },
  lobby: {
    models: [...],
    physics: {...},
  },
};
```

### 4. Разделить типы

```tsx
// shared/types/ - только общие типы
// features/*/model/*-types.ts - типы фичи
// entities/*/model/*-types.ts - типы сущности
```

---

## 📋 Чеклист миграции

### Приоритет 1 (Критично):
- [ ] Переместить stores из `widgets/store/` в `features/*/model/`
- [ ] Обновить все импорты stores
- [ ] Переместить hooks в `shared/lib/hooks/`
- [ ] Удалить дублирование `pages/`

### Приоритет 2 (Важно):
- [ ] Создать полную структуру для features (api, lib, model, ui)
- [ ] Создать публичные API (index.ts) для features
- [ ] Реорганизовать entities (lib, model, ui)
- [ ] Создать типы в model слоях

### Приоритет 3 (Желательно):
- [ ] Создать processes для сложных сценариев
- [ ] Создать API слой
- [ ] Разделить конфигурации
- [ ] Добавить документацию

---

## 🎓 Best Practices

### 1. Именование

- ✅ `kebab-case` для папок: `mission-completion`, `npc-interaction`
- ✅ `PascalCase` для компонентов: `MissionCard`, `GameHud`
- ✅ `camelCase` для функций: `completeMission`, `updateProgress`

### 2. Экспорты

- ✅ Использовать `index.ts` для публичного API
- ✅ Экспортировать только необходимое
- ✅ Группировать экспорты по типам

### 3. Импорты

- ✅ Использовать абсолютные пути через `@/`
- ✅ Импортировать через публичный API
- ✅ Избегать глубоких импортов (`../../../../`)

### 4. Типизация

- ✅ Типы рядом с использованием
- ✅ Общие типы в `shared/types/`
- ✅ Типы фичи в `features/*/model/*-types.ts`

---

## 📚 Дополнительные ресурсы

- [FSD Documentation](https://feature-sliced.design/)
- [FSD Examples](https://github.com/feature-sliced/examples)
- [Next.js App Router](https://nextjs.org/docs/app)

---

## ✅ Ожидаемые результаты

После рефакторинга:
- ✅ Четкая структура проекта
- ✅ Правильные зависимости между слоями
- ✅ Легче добавлять новые фичи
- ✅ Проще тестировать компоненты
- ✅ Лучшая переиспользуемость кода
- ✅ Масштабируемость проекта

