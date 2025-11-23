**Summary**
- **Проект:** chulakov-game — Next.js + React Three Fiber (r3f) игра/сцена.
- **Цель файла:** краткая оценка FSD-архитектуры, качества кода и оптимизаций сцен; список улучшений с короткими шагами внедрения.

**Scores (0-10)**
- **FSD Архитектура:** 7/10 — структура папок по функциям/фичам (features/, entities/, shared/, widgets/) соответствует FSD-подходу и облегчает масштабирование.
- **Качество кода:** 7/10 — преимущественно чистый TypeScript/React-код, понятные компоненты; есть места для улучшения типов, повторного использования и тестируемости.
- **Оптимизация сцен и производительность:** 6/10 — присутствует предзагрузка моделей, использование `Suspense`, `useMemo` и физики Rapier; можно улучшить батчинг, LOD, lazy-load и уменьшить лишние пересоздания сущностей.

**Strengths**
- **Файловая организация:** разделение `entities`, `features`, `shared`, `widgets` хорошо отражает FSD-подход.
- **r3f / Rapier / drei usage:** корректное применение `Canvas`, `Physics`, `useGLTF.preload` и `Suspense`.
- **Компонентность сцен:** сцены разбиты на небольшие компонентные объекты (`TableObject`, `ChairObject`, `CharacterController`) — это упрощает чтение и переиспользование.

**Issues & Risks**
- **Повторяемость коллайдеров и мешей:** в сценах много инлайновых `RigidBody`/`CuboidCollider`/`mesh` — это ведет к дублированию и усложняет массовые изменения.
- **Неоптимальные вызовы `useGLTF`:** некоторые пути в `preload-models` используют и с, и без ведущего `/` — потенциальная проблема кэша/путей.
- **Глобальные Suspense fallback = null:** если рендер зависает, UX может быть плохим; уже есть `SceneLoader`, но `Suspense` fallback нигде не показывает прогресс загрузки моделей.
- **Жёсткие таймауты в лоадерах:** `SceneLoader` скрывается через 5s вне зависимости от состояния загрузки моделей — это может привести к визуальным «провалам» при медленном соединении.
- **Типизация Rigid API:** в `character-controller` используется каст типов для Rapier API; стоит усилить типы, чтобы избежать runtime-проблем.

**Improvements (кратко, приоритеты и как сделать)**
- **1) Централизовать коллайдеры/физику (высокий приоритет):**
  - Что: вынести шаблоны коллайдеров и конфиги (`WALL_CONFIGS`, `DOOR_CONFIGS`) в `shared/scene-configs`.
  - Как: создать `src/shared/scene-configs/rooms.ts` + утилиту `renderColliders(configs)`; применять в сценах через map.
  - Почему: уменьшит дублирование, упростит изменение физики и тестирование.

- **2) Единообразный preloading и пути (средний):**
  - Что: привести все `useGLTF.preload` к консистентным путям (всегда с ведущим `/model/...`) и добавить проверку наличия файлов.
  - Как: обновить `src/shared/lib/preload-models.ts` и заменить относительные пути; добавить небольшую утилиту логирования ошибок загрузки.

- **3) LOD и динам. загрузка моделей (высокий):**
  - Что: добавить LOD (level of detail) для крупных моделей и lazy-load для внешних комнат/объектов, невидимых пользователю.
  - Как: использовать `useProgress`/`useGLTF` + `drei` LOD или написать простой LOD компонент, переключающий `mesh` на основе расстояния от камеры.
  - Почему: снижает нагрузку на GPU/CPU и уменьшает первичную нагрузку при старте.

- **4) Улучшить лоадер UX (средний):**
  - Что: `SceneLoader` должен закрываться/показывать прогресс на базе `useProgress()` вместо жёсткого timeout.
  - Как: импортировать `useProgress` из `@react-three/drei`, коннектить индикатор к прогрессу загрузки моделей/текстур.

- **5) Минимизировать пересоздание React-элементов (средний):**
  - Что: многие `useMemo` уже есть, но стоит убедиться, что объекты, передаваемые в дочерние компоненты, не пересоздаются каждый рендер.
  - Как: использовать `useMemo`/`useCallback` для конфигов и обработчиков; избегать inline-литералов в JSX для больших списков.

- **6) Типизация и тестируемость (низкий/средний):**
  - Что: добавить интерфейсы для API Rapier (удалить casting `(api as unknown as RigidApi)`) либо использовать официальные типы из `@react-three/rapier`.
  - Как: уточнить типы в `character-controller` и добавить простые unit/integration тесты для утилит (если CI есть).

**Quick How-To (конкретные команды/файлы)**
- **Примеры изменений:**
  - Вынести `WALL_CONFIGS` в `src/shared/scene-configs/lobby.ts` и в `LobbyScene` заменить `WALL_CONFIGS.map` на `renderColliders(walls)`.
  - В `src/shared/lib/preload-models.ts` заменить строки без ведущего слеша: `useGLTF.preload('model/...')` -> `useGLTF.preload('/model/...')`.
  - В `src/shared/ui/Loader/scene-loader.tsx` заменить timeout на `const { active, progress } = useProgress()` и отображать `progress`.

**Next Steps**
- Быстрый wins: правки `preload-models` и замена таймаута в `SceneLoader` на `useProgress` (1–2 часа).
- Среднесрочно: вынести конфиги сцены и добавить LOD (1–3 дня в зависимости от объема моделей).
- Долгосрочно: добавить автотесты, CI-проверки, и профилирование (webgl stats / react devtools profiler) перед релизом.

**Inspected Files / Entry Points**
- `package.json`
- `src/entities/scene/ui/lobby-scene.tsx`
- `src/entities/scene/ui/office-scene.tsx`
- `src/entities/characters/third-person-character/character-controller.tsx`
- `src/shared/lib/preload-models.ts`
- `src/shared/ui/Loader/scene-loader.tsx`
- `src/widgets/game-hud/ui/game-hud.tsx`
- `src/entities/objects/ui/table-object.tsx`

Если хотите, могу: 1) автоматически привести пути в `preload-models` и заменить таймаут в `SceneLoader` на `useProgress`; 2) вынести `WALL_CONFIGS` в общий файл и показать патч. Напишите, какой из пунктов приоритетнее.
