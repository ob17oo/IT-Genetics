This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Установка проекта:

```bash
1. Откройте терминал с нужной директорией
2. git clone https://github.com/ob17oo/IT-Genetics.git
3. npm i или npm install(Зависит от вашего пакетного менеджера)
3. npm run dev(Так же зависит от вашего пакетного менеджера)

Готово, проект запустится на localhost:3000, если он занят то будет использован другой свободный порт
```

## Архитектура проекта:

```bash
**FSD** (Feature-Sliced Design) — это методология организации кода во фронтенд-разработке, которая помогает структурировать проект по принципу разделения на фичи и слои (слайсы) для повышения масштабируемости, модульности и удобства поддержки больших приложений, особенно в React-проектах, путем создания четких правил зависимостей между частями кода.

src/
├── app/ # Next.js роутинг и конфигурация
├── pages/ # Компоненты страниц
├── widgets/ # Композитные UI-блоки (HUD, stores)
├── features/ # Бизнес-функции (missions, profile, shop)
├── entities/ # Бизнес-сущности (characters, objects, scenes)
├── shared/ # Переиспользуемый код (ui, lib, types, constants)
└── hooks/ # Переиспользуемые React хуки

```

## Игровые механики:
– **Управление персонажем** – Third-person с управлением камерой от третьего лица (**WASD** для передвижений, **SHIFT** для бега)
– **Система миссий** – Основные и побочные миссии с прогрессом выполнения и зависимости между миссиями (Вторую миссию нельзя открыть без завершения первой)
– **Взаимодействие с NPC(Non-player character)** – Диалоги с NPC, получение миссий, подсказки взаимодействия (Нажать E)
– **Валюта DNA** – Внутриигровая валюта за выполнение миссий, используетя для покупок в магазине
– **Система прогресса** – Отслеживание прогресса выполнения миссий (0-100%)
– **3D сцена** – Интерактивные 3D сцены, с физикой
## Deploy on Vercel

## Стек проекта:

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=for-the-badge&logo=redux&logoColor=white)

