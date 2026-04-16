'use client';

import { useRouter } from 'next/navigation';
import { useWorkoutStore } from '../lib/workout-store';
import { WorkoutCalendar } from '../components/WorkoutCalendar';
import { Navigation } from '../components/Navigation';

export default function CalendarPage() {
  const router = useRouter();
  const { isReady, workouts } = useWorkoutStore();
  
  const handleWorkoutSelect = (workoutId: string) => {
    router.push(`/workout/${workoutId}?from=calendar`);
  };

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
            📅 Календарь
          </h1>
          <Navigation />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <WorkoutCalendar
          workouts={workouts}
          onWorkoutSelect={handleWorkoutSelect}
        />
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Дневник тренировок MVP © 2026
        </div>
      </footer>
    </div>
  );
}
