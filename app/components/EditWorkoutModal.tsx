'use client';

import { useMemo, useState } from 'react';
import {
  formatDuration,
  formatTonnageWithKg,
  getSetLoadInfo,
  getSetLoadLabel,
  getSetsLoadInfo,
  getWorkoutLoadInfo,
} from '../lib/load-stats';
import type { Workout, SetData } from '../types';

interface EditWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workout: Workout) => void;
  workout: Workout;
  embedded?: boolean;
}

interface ExerciseForm {
  id: string;
  exerciseId: string;
  sets: SetData[];
}

let exerciseIdCounter = 0;

function createExerciseId(): string {
  exerciseIdCounter += 1;
  return `exercise-${exerciseIdCounter}`;
}

export function EditWorkoutModal({ isOpen, onClose, onSubmit, workout, embedded = false }: EditWorkoutModalProps) {
  const [workoutName, setWorkoutName] = useState(workout.name);
  const [description, setDescription] = useState(workout.description || '');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>(workout.difficulty);
  const [duration, setDuration] = useState<number | ''>(workout.duration || '');
  const [exercises, setExercises] = useState<ExerciseForm[]>(workout.exercises);
  const [isAddingExercise, setIsAddingExercise] = useState(false);

  const [newExercise, setNewExercise] = useState<ExerciseForm>({
    id: createExerciseId(),
    exerciseId: '',
    sets: [{ reps: 10, weight: 0 }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!workoutName.trim()) {
      alert('Введите название тренировки');
      return;
    }

    const workoutData: Workout = {
      ...workout,
      name: workoutName,
      description: description.trim() || undefined,
      difficulty,
      duration: duration ? Number(duration) : undefined,
      exercises,
    };

    console.log('Updating workout:', workoutData);
    onSubmit(workoutData);
  };

  const handleAddExercise = () => {
    if (newExercise.exerciseId.trim()) {
      setExercises([...exercises, { ...newExercise, id: createExerciseId() }]);
      setNewExercise({
        id: createExerciseId(),
        exerciseId: '',
        sets: [{ reps: 10, weight: 0 }],
      });
      setIsAddingExercise(false);
    }
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const handleAddSet = (exerciseId: string) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, sets: [...ex.sets, { reps: 10, weight: 0 }] }
        : ex
    ));
  };

  const handleRemoveSet = (exerciseId: string, setIndex: number) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId && ex.sets.length > 1
        ? { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) }
        : ex
    ));
  };

  const handleSetChange = (exerciseId: string, setIndex: number, field: keyof SetData, value: number) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId
        ? { ...ex, sets: ex.sets.map((set, i) => 
            i === setIndex ? { ...set, [field]: value } : set
          ) }
        : ex
    ));
  };

  const handleExerciseNameChange = (exerciseId: string, newName: string) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, exerciseId: newName } : ex
    ));
  };

  const workoutLoad = useMemo(() => getWorkoutLoadInfo(exercises), [exercises]);

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
                Редактировать тренировку
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
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {exercises.length} упражнений
                  </span>
                </div>

                <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
                  <p className="font-medium">
                    Тоннаж тренировки: {formatTonnageWithKg(workoutLoad.tonnageKg)}
                  </p>
                  <p className="mt-1">
                    С весом: {workoutLoad.weightedSets} · Собственный вес: {workoutLoad.bodyweightSets} · Кардио: {workoutLoad.cardioSets}
                    {workoutLoad.cardioDurationSec > 0 ? ` (${formatDuration(workoutLoad.cardioDurationSec)})` : ''}
                  </p>
                </div>

                <div className="space-y-4 mb-4">
                  {exercises.map((ex) => {
                    const exerciseLoad = getSetsLoadInfo(ex.sets);

                    return (
                      <div key={ex.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 pr-2">
                            <input
                              type="text"
                              value={ex.exerciseId}
                              onChange={(e) => handleExerciseNameChange(ex.id, e.target.value)}
                              className="w-full font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                              placeholder="Название упражнения"
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {ex.sets.length} подходов
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                              Тоннаж упражнения: {formatTonnageWithKg(exerciseLoad.tonnageKg)} · СВ: {exerciseLoad.bodyweightSets} · Кардио: {exerciseLoad.cardioSets}
                              {exerciseLoad.cardioDurationSec > 0 ? ` (${formatDuration(exerciseLoad.cardioDurationSec)})` : ''}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(ex.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex-shrink-0 cursor-pointer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {ex.sets.map((set, index) => {
                            const setLoad = getSetLoadInfo(set);

                            return (
                              <div key={index} className="rounded-md border border-gray-200/70 bg-white/70 p-2 dark:border-gray-600 dark:bg-gray-800/60">
                                <div className="space-y-2 sm:flex sm:items-center sm:gap-2 sm:space-y-0">
                                  <div className="flex items-center justify-between sm:contents">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 w-6 sm:w-8">
                                      {index + 1}.
                                    </span>
                                    {ex.sets.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveSet(ex.id, index)}
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
                                      onChange={(e) => handleSetChange(ex.id, index, 'reps', Number(e.target.value))}
                                      className="w-full sm:w-20 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">повт.</span>
                                  </div>
                                  <div className="flex items-center gap-2 sm:min-w-0">
                                    <input
                                      type="number"
                                      value={set.weight ?? 0}
                                      onChange={(e) => handleSetChange(ex.id, index, 'weight', Number(e.target.value))}
                                      className="w-full sm:w-20 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">кг</span>
                                  </div>
                                  {ex.sets.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSet(ex.id, index)}
                                      className="hidden text-red-500 hover:text-red-700 dark:text-red-400 cursor-pointer sm:block sm:ml-auto"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                                <p className="mt-2 text-xs text-blue-700 dark:text-blue-300 sm:pl-8">
                                  {getSetLoadLabel(setLoad)}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddSet(ex.id)}
                          className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          + Добавить подход
                        </button>
                      </div>
                    );
                  })}
                </div>

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
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Название упражнения
                      </label>
                      <input
                        type="text"
                        value={newExercise.exerciseId}
                        onChange={(e) => setNewExercise({ ...newExercise, exerciseId: e.target.value })}
                        placeholder="Например: отжимания"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddExercise}
                        disabled={!newExercise.exerciseId.trim()}
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
                Сохранить изменения
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
