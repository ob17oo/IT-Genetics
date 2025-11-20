import { Mission } from "../types/missionType";

export const MOCK_MISSIONS: Mission[] = [
  {
    id: 1,
    title: 'Первый коммит',
    description: 'Создай свой первый репозиторий на GitHub и сделай initial commit',
    reward: 100,
    progress: 0,
    completed: false,
    type: 'Кодинг',
    difficulty: 'Легкая'
  },
  {
    id: 2,
    title: 'Изучи основы JavaScript',
    description: 'Пройди базовый курс по JavaScript: переменные, функции, массивы, объекты',
    reward: 150,
    progress: 0,
    completed: false,
    type: 'Изучение',
    difficulty: 'Средняя'
  },
  {
    id: 3,
    title: 'React компоненты',
    description: 'Создай 5 React компонентов с использованием TypeScript',
    reward: 200,
    progress: 0,
    completed: false,
    type: 'Кодинг',
    difficulty: 'Легкая'
  },
  {
    id: 4,
    title: 'TypeScript мастер',
    description: 'Напиши 1000 строк типобезопасного кода на TypeScript',
    reward: 250,
    progress: 0,
    completed: false,
    type: 'Кодинг',
    difficulty: 'Сложная'
  },
  {
    id: 5,
    title: 'Git ветвление',
    description: 'Освой работу с git branches: создание, мерж, решение конфликтов',
    reward: 120,
    progress: 0,
    completed: false,
    type: 'Изучение',
    difficulty: 'Легкая'
  },
  {
    id: 6,
    title: 'Code Review',
    description: 'Проведи код-ревью для 3 pull requests от других разработчиков',
    reward: 180,
    progress: 0,
    completed: false,
    type: 'Командная работа',
    difficulty: 'Сложная'
  },
  {
    id: 7,
    title: 'Деплой приложения',
    description: 'Задеплой свое приложение на Vercel или Netlify',
    reward: 220,
    progress: 0,
    completed: false,
    type: 'Деплой',
    difficulty: 'Средняя'
  },
  {
    id: 8,
    title: 'Тестирование',
    description: 'Напиши unit-тесты с покрытием 80% для своего проекта',
    reward: 300,
    progress: 0,
    completed: false,
    type: 'Тестирование',
    difficulty: 'Сложная'
  },
  {
    id: 9,
    title: 'Оптимизация производительности',
    description: 'Ускорь загрузку приложения на 50% через кэширование и lazy loading',
    reward: 350,
    progress: 0,
    completed: false,
    type: 'Оптимизация',
    difficulty: 'Эксперт'
  },
  {
    id: 10,
    title: 'Менторство',
    description: 'Помоги новичку разобраться с основами программирования',
    reward: 170,
    progress: 0,
    completed: false,
    type: 'Комадная работа',
    difficulty: 'Средняя'
  }
] as const

