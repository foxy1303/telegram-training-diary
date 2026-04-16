'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { TrendLineChart } from '../../components/TrendLineChart';
import { formatDuration, formatKg, formatTonnageWithKg } from '../../lib/load-stats';
import { useWorkoutStore } from '../../lib/workout-store';
import { getExerciseTrends } from '../../lib/workout-stats';

export default function ExerciseStatsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exerciseName = searchParams.get('name') ?? '';
  const { isReady, workouts } = useWorkoutStore();
  const trend = getExerciseTrends(workouts).find((item) => item.exerciseName === exerciseName);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
      </div>
    );
  }

  if (!trend) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-200 mb-3">Тренд упражнения не найден</p>
          <button
            onClick={() => router.push('/stats')}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            К статистике
          </button>
        </div>
      </div>
    );
  }

  const dates = trend.points.map((point) => point.dateLabel);
  const tonnageSeries = trend.points.map((point) => point.tonnageKg);
  const maxWeightSeries = trend.points.map((point) => point.maxWeightKg);
  const repsSeries = trend.points.map((point) => point.repsTotal);
  const cardioSeries = trend.points.map((point) => point.cardioDurationSec);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push('/stats')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white flex-1">Тренд упражнения</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{trend.exerciseName}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Сессий: {trend.points.length} · Общий тоннаж: {formatTonnageWithKg(trend.totalTonnageKg)} · Лучший вес: {formatKg(trend.bestWeightKg)} кг
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md space-y-4">
          <TrendLineChart
            title="Тоннаж по сессиям (кг)"
            labels={dates}
            values={tonnageSeries}
            colorClassName="#2563eb"
            valueSuffix=" кг"
          />
          <TrendLineChart
            title="Максимальный вес по сессиям (кг)"
            labels={dates}
            values={maxWeightSeries}
            colorClassName="#16a34a"
            valueSuffix=" кг"
          />
          <TrendLineChart
            title="Повторения по сессиям"
            labels={dates}
            values={repsSeries}
            colorClassName="#ea580c"
          />
          {cardioSeries.some((value) => value > 0) && (
            <TrendLineChart
              title={`Кардио-время по сессиям (${formatDuration(Math.max(...cardioSeries))} max)`}
              labels={dates}
              values={cardioSeries}
              colorClassName="#9333ea"
              valueSuffix=" сек"
            />
          )}
        </section>
      </main>
    </div>
  );
}
