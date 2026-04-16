'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateWorkoutModal } from '../../components/CreateWorkoutModal';
import { useWorkoutStore } from '../../lib/workout-store';
import type { Workout, WorkoutDraftData } from '../../types';

type CreationMode = 'workout' | 'template';

interface DraftContext {
  mode: CreationMode;
  draft: WorkoutDraftData | null;
  sourceLabel?: string;
}

function emptyWorkoutDraft(): WorkoutDraftData {
  return {
    name: '',
    difficulty: 'beginner',
    exercises: [],
  };
}

export default function NewWorkoutPage() {
  const router = useRouter();
  const { isReady, workouts, templates, saveWorkout, saveTemplate, createDraftFromWorkout, createDraftFromTemplate } = useWorkoutStore();
  const [draftContext, setDraftContext] = useState<DraftContext | null>(null);

  const workoutHistory = useMemo(() => workouts.slice(0, 10), [workouts]);

  const openWorkoutDraft = (draft: WorkoutDraftData, label?: string) => {
    setDraftContext({
      mode: 'workout',
      draft,
      sourceLabel: label,
    });
  };

  const openTemplateDraft = () => {
    setDraftContext({
      mode: 'template',
      draft: emptyWorkoutDraft(),
      sourceLabel: 'новый ручной шаблон',
    });
  };

  const handleCreateWorkout = (draft: WorkoutDraftData) => {
    const created = saveWorkout(draft);
    router.push(`/workout/${created.id}?from=workouts`);
  };

  const handleCreateTemplate = (draft: WorkoutDraftData) => {
    const template = saveTemplate(draft);
    setDraftContext(null);
    alert(`Шаблон "${template.name}" сохранён`);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
      </div>
    );
  }

  if (draftContext) {
    const isTemplateMode = draftContext.mode === 'template';

    return (
      <CreateWorkoutModal
        key={`${draftContext.mode}-${draftContext.sourceLabel || 'empty'}`}
        isOpen={true}
        onClose={() => setDraftContext(null)}
        onSubmit={isTemplateMode ? handleCreateTemplate : handleCreateWorkout}
        embedded={true}
        initialDraft={draftContext.draft}
        draftLabel={draftContext.sourceLabel}
        title={isTemplateMode ? 'Новый шаблон' : 'Новая тренировка'}
        submitLabel={isTemplateMode ? 'Сохранить шаблон' : 'Сохранить тренировку'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push('/workouts')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white flex-1">
            Создать тренировку
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Быстрые действия</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() => openWorkoutDraft(emptyWorkoutDraft(), 'новая пустая тренировка')}
              className="text-left rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer"
            >
              <p className="font-medium text-gray-900 dark:text-white">Создать с нуля</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Пустой черновик тренировки</p>
            </button>
            <button
              onClick={openTemplateDraft}
              className="text-left rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer"
            >
              <p className="font-medium text-gray-900 dark:text-white">Новый шаблон вручную</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Создать и сохранить шаблон</p>
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Создать из шаблона</h2>
          {templates.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Пока нет шаблонов</p>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => openWorkoutDraft(createDraftFromTemplate(template), `копия шаблона "${template.name}"`)}
                  className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer"
                >
                  <p className="font-medium text-gray-900 dark:text-white">{template.name}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Упражнений: {template.exercises.length} · Сложность: {template.difficulty}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Создать из прошлой тренировки</h2>
          {workoutHistory.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">История тренировок пуста</p>
          ) : (
            <div className="space-y-3">
              {workoutHistory.map((workout: Workout) => (
                <button
                  key={workout.id}
                  onClick={() => openWorkoutDraft(createDraftFromWorkout(workout), `копия тренировки "${workout.name}"`)}
                  className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer"
                >
                  <p className="font-medium text-gray-900 dark:text-white">{workout.name}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Упражнений: {workout.exercises.length} · Дата: {workout.workoutDate || workout.createdAt.slice(0, 10)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
