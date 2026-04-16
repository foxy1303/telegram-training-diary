'use client';

import { useState } from 'react';
import type { SetData, WorkoutDraftData } from '../types';

interface CreateWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workout: WorkoutDraftData) => void;
  embedded?: boolean;
  initialDraft?: WorkoutDraftData | null;
  draftLabel?: string;
  title?: string;
  submitLabel?: string;
}

interface ExerciseForm {
  id: string;
  name: string;
  sets: SetData[];
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createNewSet(): SetData {
  return { reps: 10, weight: 0 };
}

function createEmptyExercise(): ExerciseForm {
  return {
    id: generateId(),
    name: '',
    sets: [createNewSet()],
  };
}

function toExerciseForm(draft: WorkoutDraftData | null | undefined): ExerciseForm[] {
  if (!draft?.exercises?.length) return [];

  return draft.exercises.map((exercise) => ({
    id: exercise.id || generateId(),
    name: exercise.exerciseId,
    sets: exercise.sets.map((set) => ({
      reps: set.reps ?? 0,
      weight: set.weight ?? 0,
      duration: set.duration,
      rpe: set.rpe,
      comment: set.comment,
    })),
  }));
}

export function CreateWorkoutModal({
  isOpen,
  onClose,
  onSubmit,
  embedded = false,
  initialDraft = null,
  draftLabel,
  title = 'Новая тренировка',
  submitLabel = 'Создать тренировку',
}: CreateWorkoutModalProps) {
  const [workoutName, setWorkoutName] = useState(initialDraft?.name || '');
  const [workoutDate, setWorkoutDate] = useState(initialDraft?.workoutDate || '');
  const [description, setDescription] = useState(initialDraft?.description || '');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>(initialDraft?.difficulty || 'beginner');
  const [duration, setDuration] = useState<number | ''>(initialDraft?.duration || '');
  const [exercises, setExercises] = useState<ExerciseForm[]>(toExerciseForm(initialDraft));
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExercise, setNewExercise] = useState<ExerciseForm>(createEmptyExercise());

  const resetForm = () => {
    setWorkoutName('');
    setWorkoutDate('');
    setDescription('');
    setDifficulty('beginner');
    setDuration('');
    setExercises([]);
    setIsAddingExercise(false);
    setNewExercise(createEmptyExercise());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!workoutName.trim()) {
      alert('Введите название тренировки');
      return;
    }

    const workoutData: WorkoutDraftData = {
      name: workoutName.trim(),
      workoutDate: workoutDate || undefined,
      description: description.trim() || undefined,
      difficulty,
      duration: duration ? Number(duration) : undefined,
      exercises: exercises.map((ex) => ({
        id: ex.id,
        exerciseId: ex.name.trim(),
        sets: ex.sets.map((set) => ({
          reps: set.reps || 0,
          weight: set.weight ?? 0,
          duration: set.duration,
          rpe: set.rpe,
          comment: set.comment,
        })),
      })),
    };

    onSubmit(workoutData);
    resetForm();
  };

  const handleAddExercise = () => {
    if (newExercise.name.trim()) {
      setExercises((prev) => [...prev, { ...newExercise, id: generateId() }]);
      setNewExercise(createEmptyExercise());
      setIsAddingExercise(false);
    }
  };

  const handleRemoveExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const handleExerciseNameChange = (exerciseId: string, nextName: string) => {
    setExercises((prev) => prev.map((ex) => (ex.id === exerciseId ? { ...ex, name: nextName } : ex)));
  };

  const handleAddSetToExercise = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === exerciseId ? { ...ex, sets: [...ex.sets, createNewSet()] } : ex))
    );
  };

  const handleRemoveSetFromExercise = (exerciseId: string, setIndex: number) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.filter((_, index) => index !== setIndex) }
          : ex
      )
    );
  };

  const handleExerciseSetChange = (
    exerciseId: string,
    setIndex: number,
    field: keyof SetData,
    value: number | string
  ) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set, index) => (index === setIndex ? { ...set, [field]: value } : set)),
            }
          : ex
      )
    );
  };

  const handleAddSet = () => {
    setNewExercise((prev) => ({
      ...prev,
      sets: [...prev.sets, createNewSet()],
    }));
  };

  const handleRemoveSet = (setIndex: number) => {
    setNewExercise((prev) => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== setIndex),
    }));
  };

  const handleSetChange = (setIndex: number, field: keyof SetData, value: number | string) => {
    setNewExercise((prev) => ({
      ...prev,
      sets: prev.sets.map((set, i) => (i === setIndex ? { ...set, [field]: value } : set)),
    }));
  };

  if (!isOpen) return null;

  const containerClass = embedded
    ? 'w-full'
    : 'fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4';

  const contentClass = embedded
    ? 'bg-white dark:bg-gray-800 rounded-xl shadow-md w-full'
    : 'bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto';

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {draftLabel && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                Черновик: {draftLabel}. Данные пока не сохранены, вы можете свободно отредактировать их перед сохранением.
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Название тренировки <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="Например: Утренняя силовая"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Дата тренировки <span className="text-gray-400 dark:text-gray-500 text-xs">(можно оставить пустой)</span>
                </label>
                <input
                  type="date"
                  value={workoutDate}
                  onChange={(e) => setWorkoutDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Описание <span className="text-gray-400 dark:text-gray-500 text-xs">(необязательно)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Краткое описание тренировки..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Сложность
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="beginner">Начальный</option>
                    <option value="intermediate">Средний</option>
                    <option value="advanced">Продвинутый</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Длительность (минуты) <span className="text-gray-400 dark:text-gray-500 text-xs">(необязательно)</span>
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : '')}
                    placeholder="45"
                    min="1"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Упражнения
                  </label>
                  {exercises.length > 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {exercises.length} добавлено
                    </span>
                  )}
                </div>

                {exercises.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {exercises.map((ex) => (
                      <div
                        key={ex.id}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={ex.name}
                              onChange={(e) => handleExerciseNameChange(ex.id, e.target.value)}
                              className="w-full font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                              placeholder="Название упражнения"
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {ex.sets.length} подходов
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(ex.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {ex.sets.map((set, setIndex) => (
                            <div key={setIndex} className="space-y-2 sm:flex sm:items-center sm:gap-2 sm:space-y-0">
                              <div className="flex items-center justify-between sm:contents">
                                <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                                  {setIndex + 1}.
                                </span>
                                {ex.sets.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSetFromExercise(ex.id, setIndex)}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 cursor-pointer sm:hidden"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center gap-2 sm:min-w-0">
                                <input
                                  type="number"
                                  value={set.reps}
                                  onChange={(e) => handleExerciseSetChange(ex.id, setIndex, 'reps', Number(e.target.value))}
                                  placeholder="повт."
                                  className="w-full sm:w-20 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">повт.</span>
                              </div>
                              <div className="flex items-center gap-2 sm:min-w-0">
                                <input
                                  type="number"
                                  value={set.weight ?? 0}
                                  onChange={(e) => handleExerciseSetChange(ex.id, setIndex, 'weight', Number(e.target.value))}
                                  placeholder="кг"
                                  className="w-full sm:w-20 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">кг</span>
                              </div>
                              {ex.sets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSetFromExercise(ex.id, setIndex)}
                                  className="hidden text-red-500 hover:text-red-700 dark:text-red-400 cursor-pointer sm:block sm:ml-auto"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddSetToExercise(ex.id)}
                          className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          + Добавить подход
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {!isAddingExercise ? (
                  <button
                    type="button"
                    onClick={() => setIsAddingExercise(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Добавить упражнение
                  </button>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Название упражнения
                      </label>
                      <input
                        type="text"
                        value={newExercise.name}
                        onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                        placeholder="Например: отжимания"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Подходы
                        </label>
                        <button
                          type="button"
                          onClick={handleAddSet}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          + Добавить подход
                        </button>
                      </div>

                      <div className="space-y-2">
                        {newExercise.sets.map((set, index) => (
                          <div key={index} className="space-y-2 sm:flex sm:items-center sm:gap-2 sm:space-y-0">
                            <div className="flex items-center justify-between sm:contents">
                              <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                                {index + 1}.
                              </span>
                              {newExercise.sets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSet(index)}
                                  className="text-red-500 hover:text-red-700 dark:text-red-400 cursor-pointer sm:hidden"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-2 sm:min-w-0">
                              <input
                                type="number"
                                value={set.reps}
                                onChange={(e) => handleSetChange(index, 'reps', Number(e.target.value))}
                                placeholder="повт."
                                className="w-full sm:w-20 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">повт.</span>
                            </div>
                            <div className="flex items-center gap-2 sm:min-w-0">
                              <input
                                type="number"
                                value={set.weight ?? 0}
                                onChange={(e) => handleSetChange(index, 'weight', Number(e.target.value))}
                                placeholder="кг"
                                className="w-full sm:w-20 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">кг</span>
                            </div>
                            {newExercise.sets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSet(index)}
                                className="hidden text-red-500 hover:text-red-700 dark:text-red-400 cursor-pointer sm:block sm:ml-auto"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddExercise}
                        disabled={!newExercise.name.trim()}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Добавить
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingExercise(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-xl border-t border-gray-200 dark:border-gray-600">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium py-3 cursor-pointer"
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
