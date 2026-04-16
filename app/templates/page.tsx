'use client';

import { useRouter } from 'next/navigation';
import { useWorkoutStore } from '../lib/workout-store';
import { Navigation } from '../components/Navigation';

export default function TemplatesPage() {
  const router = useRouter();
  const { isReady, templates, createDraftFromTemplate } = useWorkoutStore();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
      </div>
    );
  }

  const handleUseTemplate = (template: typeof templates[0]) => {
    router.push(`/workouts/new?draft=${encodeURIComponent(JSON.stringify(createDraftFromTemplate(template)))}`);
  };

  const handleViewDetails = (template: typeof templates[0]) => {
    router.push(`/templates/${template.id}`);
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
            📝 Шаблоны тренировок
          </h1>
          <Navigation />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-700 dark:text-gray-200 mb-3">Пока нет сохранённых шаблонов</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Создайте тренировку и сохраните её как шаблон для быстрого повторения
            </p>
            <button
              onClick={() => router.push('/workouts/new')}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              Создать тренировку
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Всего шаблонов: <span className="font-semibold text-gray-900 dark:text-white">{templates.length}</span>
              </p>
            </div>

            <div className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleViewDetails(template)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h3>
                      {template.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{template.description}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty === 'beginner' ? 'Начальный' : template.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      {template.exercises.length} упражнений
                    </span>
                    {template.duration && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {template.duration} мин
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(template.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>

                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(template);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm cursor-pointer transition-colors"
                    >
                      Использовать
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(template);
                      }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm cursor-pointer transition-colors"
                    >
                      Подробнее
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Дневник тренировок MVP © 2026
        </div>
      </footer>
    </div>
  );
}
