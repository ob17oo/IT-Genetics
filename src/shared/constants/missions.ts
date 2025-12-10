import { Mission } from "../types/missionType";

export const MAIN_MISSION: Mission[] = [
  
]


export const MOCK_MISSIONS: Mission[] = [
  {
    id: 1,
    title: "Ответственность: Выбор под давлением",
    description: "Найди выделенный красным объект — источник ошибки в системе — и нажми E, чтобы взять ответственность за её устранение.",
    reward: 30,
    progress: 0,
    completed: false,
    type: 'main',
    difficulty: 'medium',
    requires: null,
    relatedNPC: 1   
  }, 
  {
    id: 2,
    title: "Прозрачность: Включи статус-панель",
    description: "Активируй информационную панель, чтобы команда могла видеть статус проекта.",
    reward: 35,
    progress: 0,
    completed: false,
    type: 'main',
    difficulty: 'easy',
    requires: 1,
    relatedNPC: 2
  },
  {
    id: 3,
    title: "Скорость: Собери данные за 20 секунд",
    description: "Собери три объекта в ограниченное время, чтобы показать скорость работы.",
    reward: 40,
    progress: 0,
    completed: false,
    type: 'main',
    difficulty: 'hard',
    requires: 2
  },
  {
    id: 4,
    title: "Открытое общение: передай сообщение NPC",
    description: "Подойди к NPC и нажми E, чтобы передать важное сообщение команде.",
    reward: 20,
    progress: 0, 
    completed: false,
    type: 'main',
    difficulty: 'easy',
    requires: 3
  },
  {
    id: 5,
    title: "Развитие: Протестируй новый инструмент",
    description: "Активируй новый тестовый инструмент в экспериментальной зоне, чтобы опробовать новые подходы.",
    reward: 45,
    progress: 0,
    completed: false,
    type: 'main',
    difficulty: 'hard',
    requires: 4
  },
  {
    id: 6,
    title: 'Обойти офис',
    description: 'Прогуляйся по офису',
    reward: 20,
    progress: 0,
    completed: false,
    type: 'side',
    difficulty: 'easy',
    requires: null
  },
  {
    id: 7,
    title: 'Поговорить с NPC',
    description: "Поговорить с NPC и узнать про компанию",
    reward: 20,
    progress: 0,
    completed: false,
    type: 'side',
    difficulty: 'easy',
    requires: 1
    
  },
  {
    id: 8,
    title: 'Помоги коллеге',
    description: 'Работник потерял свой пропуск, помоги ему найти его',
    reward: 30,
    progress: 0,
    completed: false,
    type: 'side',
    difficulty: 'easy',
    requires: 2
  },
  {
    id: 9,
    title: 'Прокачай основы React',
    description: 'Прокачай знания React до второго уровня',
    reward: 35,
    progress: 0,
    completed: false,
    type: 'side',
    difficulty: 'easy',
    requires: 3
  },
  {
    id: 10,
    title: 'GitHub',
    description: 'Купи знания GitHub в магазине',
    reward: 50,
    progress: 0,
    completed: false,
    type: 'side',
    difficulty: 'medium',
    requires: 4
  },
  {
    id: 11,
    title: 'Прокачай основы JavaScript',
    description: 'Прокачай знания JavaScript до второго уровня',
    reward: 30,
    progress: 0,
    completed: false,
    type: 'side',
    difficulty: 'easy',
    requires: 5
  },
  {
    id: 12,
    title: 'Деплой приложения',
    description: 'Задеплой свое приложение на Vercel или Netlify',
    reward: 220,
    progress: 0,
    completed: false,
    type: 'side',
    difficulty: 'medium',
    requires: 6
  },
  {
    id: 13,
    title: 'Тестирование',
    description: 'Запусти тестирование проекта',
    reward: 50,
    progress: 0,
    completed: false,
    type: 'side',
    difficulty: 'hard',
    requires: 7
  },
  {
    id: 14,
    title: 'Оптимизация производительности',
    description: 'Ускорь загрузку приложения на 50% через кэширование и lazy loading',
    reward: 350,
    progress: 0,
    completed: false,
    type: 'side',
    difficulty: 'Expert',
    requires: 8
  },
  {
    id: 15,
    title: 'Менторство',
    description: 'Помоги новичку разобраться с основами программирования',
    reward: 170,
    progress: 0,
    completed: false,
    type: 'side',
    difficulty: 'medium',
    requires: 9
  }
] as const

