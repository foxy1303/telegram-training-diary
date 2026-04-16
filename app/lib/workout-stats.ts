import { mockExercises } from './mock-data';
import { getSetsLoadInfo } from './load-stats';
import type { SetData, Workout, WorkoutExercise } from '../types';

export interface WorkoutExerciseStats {
  id: string;
  name: string;
  setsCount: number;
  repsTotal: number;
  weightedSets: number;
  bodyweightSets: number;
  cardioSets: number;
  cardioDurationSec: number;
  tonnageKg: number;
  maxWeightKg: number;
}

export interface WorkoutStats {
  workout: Workout;
  dateLabel: string;
  setsCount: number;
  repsTotal: number;
  weightedSets: number;
  bodyweightSets: number;
  cardioSets: number;
  cardioDurationSec: number;
  tonnageKg: number;
  maxWeightKg: number;
  exercises: WorkoutExerciseStats[];
}

export interface ExerciseTrendPoint {
  workoutId: string;
  workoutName: string;
  dateLabel: string;
  setsCount: number;
  repsTotal: number;
  weightedSets: number;
  bodyweightSets: number;
  cardioSets: number;
  cardioDurationSec: number;
  tonnageKg: number;
  maxWeightKg: number;
}

export interface ExerciseTrend {
  exerciseName: string;
  points: ExerciseTrendPoint[];
  totalTonnageKg: number;
  totalReps: number;
  bestWeightKg: number;
}

export interface GlobalStats {
  workoutsCount: number;
  setsCount: number;
  repsTotal: number;
  weightedSets: number;
  bodyweightSets: number;
  cardioSets: number;
  cardioDurationSec: number;
  tonnageKg: number;
  maxWeightKg: number;
}

const exerciseNameById = new Map(mockExercises.map((ex) => [ex.id, ex.name]));

function normalizeExerciseName(raw: string): string {
  return raw.trim().toLowerCase();
}

export function resolveExerciseName(exerciseIdOrName: string): string {
  return exerciseNameById.get(exerciseIdOrName) ?? exerciseIdOrName;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getExerciseStats(exercise: WorkoutExercise): WorkoutExerciseStats {
  const setsLoad = getSetsLoadInfo(exercise.sets);
  const repsTotal = exercise.sets.reduce((sum, set) => sum + (set.reps || 0), 0);
  const maxWeightKg = exercise.sets.reduce((max, set) => Math.max(max, set.weight || 0), 0);

  return {
    id: exercise.id,
    name: resolveExerciseName(exercise.exerciseId),
    setsCount: exercise.sets.length,
    repsTotal,
    weightedSets: setsLoad.weightedSets,
    bodyweightSets: setsLoad.bodyweightSets,
    cardioSets: setsLoad.cardioSets,
    cardioDurationSec: setsLoad.cardioDurationSec,
    tonnageKg: setsLoad.tonnageKg,
    maxWeightKg,
  };
}

export function getWorkoutStats(workout: Workout): WorkoutStats {
  const exercises = workout.exercises.map(getExerciseStats);
  const dateSource = workout.workoutDate || workout.createdAt;

  return {
    workout,
    dateLabel: formatDate(dateSource),
    setsCount: exercises.reduce((sum, ex) => sum + ex.setsCount, 0),
    repsTotal: exercises.reduce((sum, ex) => sum + ex.repsTotal, 0),
    weightedSets: exercises.reduce((sum, ex) => sum + ex.weightedSets, 0),
    bodyweightSets: exercises.reduce((sum, ex) => sum + ex.bodyweightSets, 0),
    cardioSets: exercises.reduce((sum, ex) => sum + ex.cardioSets, 0),
    cardioDurationSec: exercises.reduce((sum, ex) => sum + ex.cardioDurationSec, 0),
    tonnageKg: exercises.reduce((sum, ex) => sum + ex.tonnageKg, 0),
    maxWeightKg: exercises.reduce((max, ex) => Math.max(max, ex.maxWeightKg), 0),
    exercises,
  };
}

export function getGlobalStats(workouts: Workout[]): GlobalStats {
  const workoutStats = workouts.map(getWorkoutStats);

  return {
    workoutsCount: workouts.length,
    setsCount: workoutStats.reduce((sum, stats) => sum + stats.setsCount, 0),
    repsTotal: workoutStats.reduce((sum, stats) => sum + stats.repsTotal, 0),
    weightedSets: workoutStats.reduce((sum, stats) => sum + stats.weightedSets, 0),
    bodyweightSets: workoutStats.reduce((sum, stats) => sum + stats.bodyweightSets, 0),
    cardioSets: workoutStats.reduce((sum, stats) => sum + stats.cardioSets, 0),
    cardioDurationSec: workoutStats.reduce((sum, stats) => sum + stats.cardioDurationSec, 0),
    tonnageKg: workoutStats.reduce((sum, stats) => sum + stats.tonnageKg, 0),
    maxWeightKg: workoutStats.reduce((max, stats) => Math.max(max, stats.maxWeightKg), 0),
  };
}

function getTrendPoint(workout: Workout, exerciseName: string, workoutExercises: WorkoutExercise[]): ExerciseTrendPoint {
  const matching = workoutExercises.filter((ex) => normalizeExerciseName(resolveExerciseName(ex.exerciseId)) === exerciseName);
  const allSets: SetData[] = matching.flatMap((ex) => ex.sets);
  const load = getSetsLoadInfo(allSets);
  const dateSource = workout.workoutDate || workout.createdAt;

  return {
    workoutId: workout.id,
    workoutName: workout.name,
    dateLabel: formatDate(dateSource),
    setsCount: allSets.length,
    repsTotal: allSets.reduce((sum, set) => sum + (set.reps || 0), 0),
    weightedSets: load.weightedSets,
    bodyweightSets: load.bodyweightSets,
    cardioSets: load.cardioSets,
    cardioDurationSec: load.cardioDurationSec,
    tonnageKg: load.tonnageKg,
    maxWeightKg: allSets.reduce((max, set) => Math.max(max, set.weight || 0), 0),
  };
}

export function getExerciseTrends(workouts: Workout[]): ExerciseTrend[] {
  const sorted = [...workouts].sort((a, b) => {
    const aDate = new Date(a.workoutDate || a.createdAt).getTime();
    const bDate = new Date(b.workoutDate || b.createdAt).getTime();
    return aDate - bDate;
  });
  const names = new Set<string>();
  const displayNameMap = new Map<string, string>();

  sorted.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const resolvedName = resolveExerciseName(exercise.exerciseId);
      const normalizedName = normalizeExerciseName(resolvedName);

      names.add(normalizedName);
      if (!displayNameMap.has(normalizedName)) {
        displayNameMap.set(normalizedName, resolvedName);
      }
    });
  });

  return Array.from(names).map((name) => {
    const points = sorted
      .map((workout) => getTrendPoint(workout, name, workout.exercises))
      .filter((point) => point.setsCount > 0);

    return {
      exerciseName: displayNameMap.get(name) ?? name,
      points,
      totalTonnageKg: points.reduce((sum, point) => sum + point.tonnageKg, 0),
      totalReps: points.reduce((sum, point) => sum + point.repsTotal, 0),
      bestWeightKg: points.reduce((max, point) => Math.max(max, point.maxWeightKg), 0),
    };
  }).sort((a, b) => b.points.length - a.points.length || b.totalTonnageKg - a.totalTonnageKg);
}
