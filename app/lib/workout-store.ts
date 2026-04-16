'use client';

import { useMemo, useState } from 'react';
import { mockWorkouts } from './mock-data';
import type { SetData, Workout, WorkoutDraftData, WorkoutTemplate } from '../types';

const WORKOUTS_KEY = 'ttd.workouts.v1';
const TEMPLATES_KEY = 'ttd.templates.v1';

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function copySetData(set: SetData): SetData {
  return {
    reps: set.reps || 0,
    weight: set.weight ?? 0,
    duration: set.duration,
    rpe: set.rpe,
    comment: set.comment,
  };
}

function deepCopyExercises(exercises: Workout['exercises']): Workout['exercises'] {
  return exercises.map((exercise) => ({
    ...exercise,
    id: generateId(),
    sets: exercise.sets.map(copySetData),
  }));
}

function toDraftFromWorkout(workout: Workout): WorkoutDraftData {
  return {
    name: workout.name,
    description: workout.description,
    duration: workout.duration,
    difficulty: workout.difficulty,
    tags: workout.tags,
    exercises: deepCopyExercises(workout.exercises),
  };
}

function toDraftFromTemplate(template: WorkoutTemplate): WorkoutDraftData {
  return {
    name: template.name,
    description: template.description,
    duration: template.duration,
    difficulty: template.difficulty,
    tags: template.tags,
    exercises: deepCopyExercises(template.exercises),
  };
}

function buildDefaultTemplates(): WorkoutTemplate[] {
  return mockWorkouts.slice(0, 2).map((workout) => ({
    id: `tpl-${workout.id}`,
    name: `Шаблон: ${workout.name}`,
    description: workout.description,
    exercises: deepCopyExercises(workout.exercises),
    duration: workout.duration,
    difficulty: workout.difficulty,
    tags: workout.tags,
    createdAt: new Date().toISOString(),
    sourceWorkoutId: workout.id,
  }));
}

function readFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function initWorkoutsStore(): Workout[] {
  const stored = readFromStorage<Workout[]>(WORKOUTS_KEY);
  return stored && stored.length > 0 ? stored : [...mockWorkouts];
}

function initTemplatesStore(): WorkoutTemplate[] {
  const stored = readFromStorage<WorkoutTemplate[]>(TEMPLATES_KEY);
  return stored && stored.length > 0 ? stored : buildDefaultTemplates();
}

let workoutsStore: Workout[] = initWorkoutsStore();
let templatesStore: WorkoutTemplate[] = initTemplatesStore();

function normalizeDraftInput(draft: WorkoutDraftData): WorkoutDraftData {
  return {
    ...draft,
    name: draft.name.trim(),
    description: draft.description?.trim() || undefined,
    tags: draft.tags?.filter(Boolean),
    exercises: deepCopyExercises(draft.exercises),
  };
}

export function useWorkoutStore() {
  const [workouts, setWorkouts] = useState<Workout[]>(workoutsStore);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>(templatesStore);

  const sortedWorkouts = useMemo(
    () =>
      [...workouts].sort((a, b) => {
        const aDate = new Date(a.workoutDate || a.createdAt).getTime();
        const bDate = new Date(b.workoutDate || b.createdAt).getTime();
        return bDate - aDate;
      }),
    [workouts]
  );

  const saveWorkout = (draft: WorkoutDraftData): Workout => {
    const normalized = normalizeDraftInput(draft);
    const workout: Workout = {
      ...normalized,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    setWorkouts((prev) => {
      const next = [workout, ...prev];
      workoutsStore = next;
      writeToStorage(WORKOUTS_KEY, next);
      return next;
    });

    return workout;
  };

  const updateWorkout = (workoutId: string, draft: WorkoutDraftData): Workout | null => {
    const normalized = normalizeDraftInput(draft);
    const existing = workouts.find((item) => item.id === workoutId);
    if (!existing) return null;

    const updated: Workout = {
      ...existing,
      ...normalized,
    };

    setWorkouts((prev) => {
      const next = prev.map((item) => (item.id === workoutId ? updated : item));
      workoutsStore = next;
      writeToStorage(WORKOUTS_KEY, next);
      return next;
    });

    return updated;
  };

  const saveTemplate = (draft: WorkoutDraftData, sourceWorkoutId?: string): WorkoutTemplate => {
    const normalized = normalizeDraftInput(draft);
    const template: WorkoutTemplate = {
      ...normalized,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sourceWorkoutId,
    };

    setTemplates((prev) => {
      const next = [template, ...prev];
      templatesStore = next;
      writeToStorage(TEMPLATES_KEY, next);
      return next;
    });

    return template;
  };

  const findWorkoutById = (id: string): Workout | null => workouts.find((item) => item.id === id) ?? null;
  const findTemplateById = (id: string): WorkoutTemplate | null => templates.find((item) => item.id === id) ?? null;

  return {
    isReady: true,
    workouts: sortedWorkouts,
    templates,
    saveWorkout,
    updateWorkout,
    saveTemplate,
    findWorkoutById,
    findTemplateById,
    createDraftFromWorkout: toDraftFromWorkout,
    createDraftFromTemplate: toDraftFromTemplate,
  };
}
