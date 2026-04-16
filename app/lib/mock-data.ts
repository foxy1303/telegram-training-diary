import type { Exercise, Workout } from '../types';

export const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Приседания',
    description: 'Классические приседания с собственным весом',
    muscleGroup: 'ноги',
    type: 'strength',
  },
  {
    id: '2',
    name: 'Отжимания',
    description: 'Классические отжимания от пола',
    muscleGroup: 'грудь',
    type: 'strength',
  },
  {
    id: '3',
    name: 'Подтягивания',
    description: 'Подтягивания на перекладине',
    muscleGroup: 'спина',
    type: 'strength',
  },
  {
    id: '4',
    name: 'Планка',
    description: 'Статическое упражнение планка',
    muscleGroup: 'пресс',
    type: 'strength',
  },
  {
    id: '5',
    name: 'Бег',
    description: 'Лёгкий бег трусцой',
    muscleGroup: 'все тело',
    type: 'cardio',
  },
];

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Утренняя зарядка',
    description: 'Лёгкая тренировка для пробуждения',
    exercises: [
      { 
        id: 'e1', 
        exerciseId: '1', 
        sets: [
          { reps: 15, weight: 0 },
          { reps: 15, weight: 0 }
        ] 
      },
      { 
        id: 'e2', 
        exerciseId: '2', 
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 }
        ] 
      },
      { 
        id: 'e3', 
        exerciseId: '4', 
        sets: [{ reps: 1, duration: 30 }] 
      },
    ],
    duration: 15,
    difficulty: 'beginner',
    tags: ['утро', 'лёгкая'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Силовая полная тела',
    description: 'Базовая тренировка на все группы мышц',
    exercises: [
      { 
        id: 'e4', 
        exerciseId: '1', 
        sets: [
          { reps: 12, weight: 60 },
          { reps: 12, weight: 65 },
          { reps: 10, weight: 70 },
          { reps: 8, weight: 70 }
        ] 
      },
      { 
        id: 'e5', 
        exerciseId: '2', 
        sets: [
          { reps: 12, weight: 0 },
          { reps: 12, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 8, weight: 0 }
        ] 
      },
      { 
        id: 'e6', 
        exerciseId: '3', 
        sets: [
          { reps: 8, weight: 0 },
          { reps: 8, weight: 0 },
          { reps: 7, weight: 0 },
          { reps: 6, weight: 0 }
        ] 
      },
      { 
        id: 'e7', 
        exerciseId: '4', 
        sets: [
          { reps: 1, duration: 60 },
          { reps: 1, duration: 50 },
          { reps: 1, duration: 45 }
        ] 
      },
    ],
    duration: 45,
    difficulty: 'intermediate',
    tags: ['сила', 'все тело'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Кардио сессия',
    description: 'Интенсивная кардио тренировка',
    exercises: [
      { 
        id: 'e8', 
        exerciseId: '5', 
        sets: [{ reps: 1, duration: 1800 }] 
      },
    ],
    duration: 30,
    difficulty: 'intermediate',
    tags: ['кардио', 'выносливость'],
    createdAt: new Date().toISOString(),
  },
];
