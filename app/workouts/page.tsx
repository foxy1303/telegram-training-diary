'use client';

import { useWorkoutStore } from '../lib/workout-store';
import { WorkoutList } from '../components/WorkoutList';
import { Navigation } from '../components/Navigation';

export default function WorkoutsPage() {
  const { isReady, workouts } = useWorkoutStore();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            📋 Дневник тренировок
          </h1>
          <Navigation />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <WorkoutList workouts={workouts} />
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Дневник тренировок MVP © 2026
        </div>
      </footer>
    </div>
  );
}
