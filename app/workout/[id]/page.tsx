'use client';

import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { PaginationControls } from '../../components/PaginationControls';
import { useWorkoutStore } from '../../lib/workout-store';
import {
  formatDuration,
  formatTonnageWithKg,
  getSetLoadInfo,
  getSetLoadLabel,
  getSetsLoadInfo,
  getWorkoutLoadInfo,
} from '../../lib/load-stats';
import { useResponsivePageSize } from '../../lib/use-responsive-page-size';

export default function WorkoutPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const workoutId = params.id as string;
  const from = searchParams.get('from');
  const exercisesPageSize = useResponsivePageSize({ mobile: 2, tablet: 3, desktop: 4 });
  const { isReady, findWorkoutById, saveTemplate, createDraftFromWorkout } = useWorkoutStore();
  const workout = findWorkoutById(workoutId);
  const [exercisesPage, setExercisesPage] = useState(1);
  const workoutExercises = workout?.exercises ?? [];
  const exercisesTotalPages = Math.max(1, Math.ceil(workoutExercises.length / exercisesPageSize));
  const safeExercisesPage = Math.min(exercisesPage, exercisesTotalPages);
  const exercisesStartIndex = (safeExercisesPage - 1) * exercisesPageSize;
  const pagedExercises = workoutExercises.slice(exercisesStartIndex, exercisesStartIndex + exercisesPageSize);

  const handleBack = () => {
    if (from === 'calendar') {
      router.push('/calendar');
      return;
    }

    router.push('/workouts');
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

  const workoutLoad = getWorkoutLoadInfo(workout.exercises);

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
            {workout.name}
          </h1>
          <button
            onClick={() => {
              const workoutFrom = from === 'calendar' ? 'calendar' : 'workouts';
              router.push(`/stats/workout/${workout.id}?from=workout&workoutFrom=${workoutFrom}`);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            title="Статистика тренировки"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M8 14l3-3 3 2 4-5" />
            </svg>
          </button>
          <button
            onClick={() => {
              saveTemplate(createDraftFromWorkout(workout), workout.id);
              alert('Тренировка сохранена как шаблон');
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            title="Сохранить как шаблон"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h14v14H5zM8 5v4h8V5" />
            </svg>
          </button>
          <button
            onClick={() => {
              const query = from === 'calendar' ? '?from=calendar' : '?from=workouts';
              router.push(`/workouts/${workout.id}/edit${query}`);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          {workout.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {workout.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            {workout.duration && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {workout.duration} мин
              </span>
            )}
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              {workout.exercises.length} упражнений
            </span>
          </div>
          <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
            <p className="font-medium">
              Тоннаж тренировки: {formatTonnageWithKg(workoutLoad.tonnageKg)}
            </p>
            <p className="mt-1 text-xs">
              С весом: {workoutLoad.weightedSets} · Собственный вес: {workoutLoad.bodyweightSets} · Кардио: {workoutLoad.cardioSets}
              {workoutLoad.cardioDurationSec > 0 ? ` (${formatDuration(workoutLoad.cardioDurationSec)})` : ''}
            </p>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Упражнения:
          </h2>

          <div className="space-y-4">
            {pagedExercises.map((ex, index) => {
              const exerciseLoad = getSetsLoadInfo(ex.sets);
              const globalIndex = exercisesStartIndex + index + 1;

              return (
                <div
                  key={ex.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="mb-3">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {globalIndex}. {ex.exerciseId}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Тоннаж упражнения: {formatTonnageWithKg(exerciseLoad.tonnageKg)} · СВ: {exerciseLoad.bodyweightSets} · Кардио: {exerciseLoad.cardioSets}
                      {exerciseLoad.cardioDurationSec > 0 ? ` (${formatDuration(exerciseLoad.cardioDurationSec)})` : ''}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {ex.sets.map((set, setIndex) => {
                      const setLoad = getSetLoadInfo(set);

                      return (
                        <div key={setIndex} className="rounded-md bg-gray-50 p-2 text-sm dark:bg-gray-900/30">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 dark:text-gray-400 w-6">
                              {setIndex + 1}.
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {set.reps} повт.
                            </span>
                            {set.weight !== undefined && set.weight > 0 && (
                              <>
                                <span className="text-gray-500 dark:text-gray-400">×</span>
                                <span className="text-gray-900 dark:text-white">{set.weight} кг</span>
                              </>
                            )}
                            {set.duration && (
                              <>
                                <span className="text-gray-500 dark:text-gray-400">·</span>
                                <span className="text-gray-900 dark:text-white">
                                  {Math.floor(set.duration / 60)} мин {set.duration % 60} сек
                                </span>
                              </>
                            )}
                          </div>
                          <div className="mt-1 pl-9 text-xs text-blue-700 dark:text-blue-300">
                            {getSetLoadLabel(setLoad)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <PaginationControls
            currentPage={safeExercisesPage}
            totalPages={exercisesTotalPages}
            onPageChange={(page) => setExercisesPage(Math.max(1, Math.min(page, exercisesTotalPages)))}
            className="mt-4"
          />

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors cursor-pointer">
              Начать тренировку
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Дневник тренировок MVP © 2026
        </div>
      </footer>
    </div>
  );
}
