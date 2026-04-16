'use client';

import { useRouter, useParams } from 'next/navigation';
import { useWorkoutStore } from '../../lib/workout-store';
import { Navigation } from '../../components/Navigation';

export default function TemplateDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;
  
  const { isReady, findTemplateById, createDraftFromTemplate } = useWorkoutStore();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
      </div>
    );
  }

  const template = findTemplateById(templateId);

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-200 mb-3">Шаблон не найден</p>
          <button
            onClick={() => router.push('/templates')}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            К шаблонам
          </button>
        </div>
      </div>
    );
  }

  const handleUseTemplate = () => {
    router.push(`/workouts/new?draft=${encodeURIComponent(JSON.stringify(createDraftFromTemplate(template)))}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            📝 Детали шаблона
          </h1>
          <Navigation />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{template.name}</h2>
              {template.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
              )}
            </div>
            <span className={`px-3 py-1 rounded text-sm font-medium ${getDifficultyColor(template.difficulty)}`}>
              {template.difficulty === 'beginner' ? 'Начальный' : template.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              {template.exercises.length} упражнений
            </span>
            {template.duration && (
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {template.duration} мин
              </span>
            )}
            <span className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Создан: {new Date(template.createdAt).toLocaleDateString('ru-RU')}
            </span>
          </div>

          {template.tags && template.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {template.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleUseTemplate}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition-colors"
          >
            Использовать этот шаблон
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Упражнения</h3>
          <div className="space-y-4">
            {template.exercises.map((exercise: any, index: number) => (
              <div key={exercise.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                      {index + 1}. {exercise.exerciseId}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {exercise.sets.length} подходов
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400">Подход</th>
                        <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400">Повторения</th>
                        <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400">Вес (кг)</th>
                        <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400">RPE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set: any, setIndex: number) => (
                        <tr key={setIndex} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                          <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{setIndex + 1}</td>
                          <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{set.reps}</td>
                          <td className="py-2 px-2 text-gray-700 dark:text-gray-300">
                            {set.weight !== undefined ? set.weight : '-'}
                          </td>
                          <td className="py-2 px-2 text-gray-700 dark:text-gray-300">
                            {set.rpe !== undefined ? set.rpe : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {index < template.exercises.length - 1 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {index + 1} из {template.exercises.length} упражнений
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-6">
          <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Дневник тренировок MVP © 2026
          </div>
        </footer>
      </main>
    </div>
  );
}
