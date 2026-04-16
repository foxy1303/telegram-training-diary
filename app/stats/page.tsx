'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaginationControls } from '../components/PaginationControls';
import { formatDuration, formatKg, formatTonnageWithKg } from '../lib/load-stats';
import { useWorkoutStore } from '../lib/workout-store';
import { useResponsivePageSize } from '../lib/use-responsive-page-size';
import { getExerciseTrends, getGlobalStats, getWorkoutStats } from '../lib/workout-stats';
import { Navigation } from '../components/Navigation';

export default function StatsPage() {
  const router = useRouter();
  const { isReady, workouts: allWorkouts } = useWorkoutStore();
  const global = getGlobalStats(allWorkouts);
  const workouts = allWorkouts.map(getWorkoutStats);
  const trends = getExerciseTrends(allWorkouts);
  const workoutsPageSize = useResponsivePageSize({ mobile: 4, tablet: 6, desktop: 8 });
  const trendsPageSize = useResponsivePageSize({ mobile: 5, tablet: 7, desktop: 10 });
  const [workoutsPage, setWorkoutsPage] = useState(1);
  const [trendsPage, setTrendsPage] = useState(1);

  const workoutsTotalPages = Math.max(1, Math.ceil(workouts.length / workoutsPageSize));
  const trendsTotalPages = Math.max(1, Math.ceil(trends.length / trendsPageSize));
  const safeWorkoutsPage = Math.min(workoutsPage, workoutsTotalPages);
  const safeTrendsPage = Math.min(trendsPage, trendsTotalPages);
  const workoutsStartIndex = (safeWorkoutsPage - 1) * workoutsPageSize;
  const trendsStartIndex = (safeTrendsPage - 1) * trendsPageSize;
  const pagedWorkouts = workouts.slice(workoutsStartIndex, workoutsStartIndex + workoutsPageSize);
  const pagedTrends = trends.slice(trendsStartIndex, trendsStartIndex + trendsPageSize);

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
            📈 Статистика
          </h1>
          <Navigation />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Общий обзор</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
              <p className="text-gray-500 dark:text-gray-400">Тренировок</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{global.workoutsCount}</p>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
              <p className="text-gray-500 dark:text-gray-400">Общий тоннаж</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatTonnageWithKg(global.tonnageKg)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
              <p className="text-gray-500 dark:text-gray-400">Повторений</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{global.repsTotal}</p>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
              <p className="text-gray-500 dark:text-gray-400">Кардио-время</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatDuration(global.cardioDurationSec)}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            С весом: {global.weightedSets} · Собственный вес: {global.bodyweightSets} · Кардио: {global.cardioSets}
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Статистика по тренировкам</h2>
          <div className="space-y-3">
            {pagedWorkouts.map((stats) => (
              <button
                key={stats.workout.id}
                onClick={() => router.push(`/stats/workout/${stats.workout.id}`)}
                className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{stats.workout.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stats.dateLabel}</p>
                  </div>
                  <span className="text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 px-2 py-1">
                    Тоннаж: {formatTonnageWithKg(stats.tonnageKg)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Повт.: {stats.repsTotal} · Макс. вес: {formatKg(stats.maxWeightKg)} кг · Кардио: {formatDuration(stats.cardioDurationSec)}
                </p>
              </button>
            ))}
          </div>
          <PaginationControls
            currentPage={safeWorkoutsPage}
            totalPages={workoutsTotalPages}
            onPageChange={(page) => setWorkoutsPage(Math.max(1, Math.min(page, workoutsTotalPages)))}
            className="mt-4"
          />
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Тренды по упражнениям</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Упражнения с одинаковыми названиями объединяются в общий тренд прогресса.
          </p>
          <div className="space-y-3">
            {pagedTrends.map((trend) => {
              const first = trend.points[0];
              const last = trend.points[trend.points.length - 1];
              const tonnageDelta = last && first ? last.tonnageKg - first.tonnageKg : 0;
              const maxWeightDelta = last && first ? last.maxWeightKg - first.maxWeightKg : 0;

              return (
                <button
                  key={trend.exerciseName}
                  onClick={() => router.push(`/stats/exercise?name=${encodeURIComponent(trend.exerciseName)}`)}
                  className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer"
                  title="Открыть график тренда"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{trend.exerciseName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Сессий: {trend.points.length} · Всего повт.: {trend.totalReps}
                      </p>
                    </div>
                    <span className="text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-2 py-1">
                      {formatTonnageWithKg(trend.totalTonnageKg)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Δ тоннаж: {tonnageDelta >= 0 ? '+' : ''}{formatKg(tonnageDelta)} кг · Δ макс. вес: {maxWeightDelta >= 0 ? '+' : ''}{formatKg(maxWeightDelta)} кг
                  </p>
                </button>
              );
            })}
          </div>
          <PaginationControls
            currentPage={safeTrendsPage}
            totalPages={trendsTotalPages}
            onPageChange={(page) => setTrendsPage(Math.max(1, Math.min(page, trendsTotalPages)))}
            className="mt-4"
          />
        </section>
      </main>
    </div>
  );
}
