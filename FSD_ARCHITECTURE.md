# FSD (Feature-Sliced Design) + Next.js App Router

## 🔍 Ключевое различие

### `src/app/` - Next.js роутинг (технический слой)
- **Назначение**: Определяет маршруты приложения
- **Содержит**: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx` и т.д.
- **Правило**: Минимум логики, только композиция из слоя `pages`

### `src/pages/` - FSD слой (бизнес-логика)
- **Назначение**: Композиция фич и виджетов для конкретных страниц
- **Содержит**: Компоненты страниц, которые собирают фичи вместе
- **Правило**: Не определяет роутинг, только UI и композицию

---

## 📁 Правильная структура

```
src/
├── app/                          # Next.js роутинг (технический слой)
│   ├── layout.tsx                # Корневой layout
│   ├── (home)/                   # Route group
│   │   └── page.tsx              # Импортирует из pages/
│   ├── about/
│   │   └── page.tsx              # Импортирует из pages/
│   └── globals.css
│
├── pages/                        # FSD слой: композиция страниц
│   ├── home/                     # Страница "Главная"
│   │   └── ui/
│   │       └── home-page.tsx     # Композиция фич для главной
│   └── about/
│       └── ui/
│           └── about-page.tsx
│
├── widgets/                      # FSD: крупные UI блоки
│   ├── header/
│   │   └── ui/
│   │       └── header.tsx
│   └── sidebar/
│       └── ui/
│           └── sidebar.tsx
│
├── features/                     # FSD: бизнес-фичи
│   ├── auth/
│   │   └── ui/
│   │       └── login-form.tsx
│   └── game-controls/
│       └── ui/
│           └── controls.tsx
│
├── entities/                     # FSD: бизнес-сущности
│   ├── objects/
│   │   └── ui/
│   │       └── computer-object.tsx
│   └── scene/
│       └── ui/
│           └── office-scene.tsx
│
├── shared/                       # FSD: переиспользуемый код
│   ├── lib/
│   │   └── preload-models.ts
│   ├── ui/
│   │   └── button.tsx
│   └── utils/
│       └── normalize-scale.ts
│
└── processes/                    # FSD: сложные бизнес-процессы
    └── game-engine/
        ├── model/
        │   └── game-store.ts
        └── ui/
            └── game-engine.tsx
```

---

## 🔄 Как это работает вместе

### Пример 1: Главная страница

**1. Next.js роутинг** (`src/app/(home)/page.tsx`):
```tsx
// Минимум кода, только импорт из pages/
import { HomePage } from "@/pages/home/ui/home-page"

export default function Home() {
  return <HomePage />
}
```

**2. FSD страница** (`src/pages/home/ui/home-page.tsx`):
```tsx
// Композиция фич и виджетов
import { OfficeScene } from "@/entities/scene/ui/office-scene"
import { GameControls } from "@/features/game-controls/ui/controls"
import { Header } from "@/widgets/header/ui/header"

export function HomePage() {
  return (
    <>
      <Header />
      <section className="w-full h-screen">
        <OfficeScene />
        <GameControls />
      </section>
    </>
  )
}
```

### Пример 2: Страница "О нас"

**1. Next.js роутинг** (`src/app/about/page.tsx`):
```tsx
import { AboutPage } from "@/pages/about/ui/about-page"

export default function About() {
  return <AboutPage />
}
```

**2. FSD страница** (`src/pages/about/ui/about-page.tsx`):
```tsx
import { Header } from "@/widgets/header/ui/header"
import { TeamInfo } from "@/features/team/ui/team-info"

export function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <TeamInfo />
      </main>
    </>
  )
}
```

---

## ✅ Правила использования

### ✅ DO (Правильно):

1. **`app/` содержит только роутинг**:
   ```tsx
   // app/(home)/page.tsx
   import { HomePage } from "@/pages/home/ui/home-page"
   export default function Home() {
     return <HomePage />
   }
   ```

2. **`pages/` содержит композицию**:
   ```tsx
   // pages/home/ui/home-page.tsx
   import { OfficeScene } from "@/entities/scene/ui/office-scene"
   import { GameControls } from "@/features/game-controls/ui/controls"
   
   export function HomePage() {
     return (
       <section>
         <OfficeScene />
         <GameControls />
       </section>
     )
   }
   ```

3. **Импорты идут снизу вверх**:
   - `app` → импортирует из `pages`
   - `pages` → импортирует из `widgets`, `features`
   - `widgets` → импортирует из `features`, `entities`
   - `features` → импортирует из `entities`, `shared`
   - `entities` → импортирует из `shared`

### ❌ DON'T (Неправильно):

1. **Не смешивайте логику в `app/`**:
   ```tsx
   // ❌ Плохо
   // app/(home)/page.tsx
   export default function Home() {
     return (
       <section>
         <OfficeScene />  // Прямой импорт из entities
         <GameControls /> // Прямой импорт из features
       </section>
     )
   }
   ```

2. **Не создавайте роутинг в `pages/`**:
   ```tsx
   // ❌ Плохо - pages не определяет роутинг
   // pages/home/page.tsx - это не работает в Next.js App Router
   ```

3. **Не импортируйте сверху вниз**:
   ```tsx
   // ❌ Плохо - нарушение FSD правил
   // entities/objects/ui/computer-object.tsx
   import { HomePage } from "@/pages/home/ui/home-page" // ❌
   ```

---

## 🎯 Для вашего проекта

### Текущая структура:
```
src/
├── app/
│   └── (home)/
│       └── page.tsx          # Импортирует OfficeScene напрямую
├── pages/
│   └── (main)/               # Пустая папка
└── entities/
    └── scene/
        └── ui/
            └── office-scene.tsx
```

### Рекомендуемая структура:

**1. Создать страницу в FSD слое:**
```
src/pages/home/ui/home-page.tsx
```

**2. Обновить Next.js роутинг:**
```tsx
// src/app/(home)/page.tsx
import { HomePage } from "@/pages/home/ui/home-page"

export default function Home() {
  return <HomePage />
}
```

**3. Переместить композицию в pages:**
```tsx
// src/pages/home/ui/home-page.tsx
import { OfficeScene } from "@/entities/scene/ui/office-scene"

export function HomePage() {
  return (
    <section className="w-full h-screen">
      <OfficeScene />
    </section>
  )
}
```

---

## 📚 Дополнительные материалы

- [FSD Documentation](https://feature-sliced.design/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [FSD + Next.js примеры](https://github.com/feature-sliced/documentation)

---

## 💡 Итог

- **`src/app/`** = Роутинг Next.js (технический слой)
- **`src/pages/`** = Композиция страниц FSD (бизнес-логика)
- **`app/page.tsx`** импортирует из **`pages/*/ui/*-page.tsx`**
- Слои не смешиваются, импорты идут снизу вверх

