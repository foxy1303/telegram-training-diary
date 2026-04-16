'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { formatDuration, formatKg, formatTonnageWithKg, getSetLoadInfo, getSetLoadLabel } from '../../../lib/load-stats';
import { useWorkoutStore } from '../../../lib/workout-store';
import { getWorkoutStats, resolveExerciseName } from '../../../lib/workout-stats';

export default function WorkoutStatsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const workoutId = params.id as string;
  const from = searchParams.get('from');
  const workoutFrom = searchParams.get('workoutFrom') === 'calendar' ? 'calendar' : 'workouts';
  const { isReady, findWorkoutById } = useWorkoutStore();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
      </div>
    );
  }

  const workout = findWorkoutById(workoutId);

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Тренировка не найдена</p>
      </div>
    );
  }

  const stats = getWorkoutStats(workout);

  const handleBack = () => {
    if (from === 'workout') {
      router.push(`/workout/${workoutId}?from=${workoutFrom}`);
      return;
    }

    router.push('/stats');
  };

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
            Статистика тренировки
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{stats.workout.name}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.dateLabel}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
              <p className="text-gray-500 dark:text-gray-400">Тоннаж</p>
              <p className="font-bold text-gray-900 dark:text-white">{formatTonnageWithKg(stats.tonnageKg)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
              <p className="text-gray-500 dark:text-gray-400">Макс. вес</p>
              <p className="font-bold text-gray-900 dark:text-white">{formatKg(stats.maxWeightKg)} кг</p>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
              <p className="text-gray-500 dark:text-gray-400">Повторений</p>
              <p className="font-bold text-gray-900 dark:text-white">{stats.repsTotal}</p>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
              <p className="text-gray-500 dark:text-gray-400">Кардио-время</p>
              <p className="font-bold text-gray-900 dark:text-white">{formatDuration(stats.cardioDurationSec)}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            С весом: {stats.weightedSets} · Собственный вес: {stats.bodyweightSets} · Кардио: {stats.cardioSets}
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Разбивка по упражнениям</h2>
          <div className="space-y-3">
            {stats.exercises.map((exercise) => (
              <div key={exercise.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{exercise.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Подходов: {exercise.setsCount} · Повт.: {exercise.repsTotal}
                    </p>
                  </div>
                  <span className="text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 px-2 py-1">
                    {formatTonnageWithKg(exercise.tonnageKg)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  С весом: {exercise.weightedSets} · СВ: {exercise.bodyweightSets} · Кардио: {exercise.cardioSets}
                  {exercise.cardioDurationSec > 0 ? ` (${formatDuration(exercise.cardioDurationSec)})` : ''}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Подходы и нагрузка</h2>
          <div className="space-y-3">
            {stats.workout.exercises.map((exercise) => (
              <div key={exercise.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <p className="font-medium text-gray-900 dark:text-white mb-2">{resolveExerciseName(exercise.exerciseId)}</p>
                <div className="space-y-2">
                  {exercise.sets.map((set, index) => {
                    const load = getSetLoadInfo(set);

                    return (
                      <div key={`${exercise.id}-${index}`} className="rounded-md bg-gray-50 dark:bg-gray-700/60 p-2">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {index + 1}. {set.reps} повт.
                          {set.weight && set.weight > 0 ? ` × ${set.weight} кг` : ''}
                          {set.duration ? ` · ${formatDuration(set.duration)}` : ''}
                        </p>
                        <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">{getSetLoadLabel(load)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
