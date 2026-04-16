'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { EditWorkoutModal } from '../../../components/EditWorkoutModal';
import { useWorkoutStore } from '../../../lib/workout-store';
import type { Workout } from '../../../types';

export default function EditWorkoutPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const workoutId = params.id as string;
  const from = searchParams.get('from') === 'calendar' ? 'calendar' : 'workouts';
  const { isReady, findWorkoutById, updateWorkout } = useWorkoutStore();
  const workout = findWorkoutById(workoutId) as Workout | null;

  const handleBack = () => {
    router.push(`/workout/${workoutId}?from=${from}`);
  };

  const handleSaveWorkout = (updatedWorkout: Workout) => {
    updateWorkout(updatedWorkout.id, {
      name: updatedWorkout.name,
      workoutDate: updatedWorkout.workoutDate,
      description: updatedWorkout.description,
      exercises: updatedWorkout.exercises,
      duration: updatedWorkout.duration,
      difficulty: updatedWorkout.difficulty,
      tags: updatedWorkout.tags,
    });
    router.push(`/workout/${updatedWorkout.id}?from=${from}`);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
      </div>
    );
  }

  if (!workout) {
    router.push('/workouts');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white flex-1">
            Редактирование
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <EditWorkoutModal
          isOpen={true}
          onClose={handleBack}
          onSubmit={handleSaveWorkout}
          workout={workout}
          embedded={true}
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
