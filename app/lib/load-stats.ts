import type { SetData } from '../types';

export type SetLoadType = 'weighted' | 'bodyweight' | 'cardio';

export interface SetLoadInfo {
  type: SetLoadType;
  tonnageKg: number;
  cardioDurationSec: number;
}

export interface AggregateLoadInfo {
  tonnageKg: number;
  weightedSets: number;
  bodyweightSets: number;
  cardioSets: number;
  cardioDurationSec: number;
}

const emptyAggregate: AggregateLoadInfo = {
  tonnageKg: 0,
  weightedSets: 0,
  bodyweightSets: 0,
  cardioSets: 0,
  cardioDurationSec: 0,
};

function toNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function formatDecimal(value: number, fractionDigits: number): string {
  return value.toFixed(fractionDigits).replace(/\.?0+$/, '').replace('.', ',');
}

export function formatKg(value: number): string {
  if (Number.isInteger(value)) {
    return `${value}`;
  }

  return formatDecimal(value, 1);
}

export function formatTonnageWithKg(valueKg: number): string {
  const tons = valueKg / 1000;
  return `${formatDecimal(tons, 2)} т (${formatKg(valueKg)} кг)`;
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutesPart = Math.floor(seconds / 60);
  const secondsPart = seconds % 60;

  if (minutesPart > 0) {
    return `${minutesPart} мин ${secondsPart} сек`;
  }

  return `${secondsPart} сек`;
}

export function getSetLoadInfo(set: SetData): SetLoadInfo {
  const reps = Math.max(0, toNumber(set.reps));
  const weight = Math.max(0, toNumber(set.weight));
  const duration = Math.max(0, toNumber(set.duration));

  if (weight > 0 && reps > 0) {
    return {
      type: 'weighted',
      tonnageKg: weight * reps,
      cardioDurationSec: 0,
    };
  }

  if (duration > 0) {
    return {
      type: 'cardio',
      tonnageKg: 0,
      cardioDurationSec: duration,
    };
  }

  return {
    type: 'bodyweight',
    tonnageKg: 0,
    cardioDurationSec: 0,
  };
}

export function getSetsLoadInfo(sets: SetData[]): AggregateLoadInfo {
  return sets.reduce<AggregateLoadInfo>((acc, set) => {
    const info = getSetLoadInfo(set);

    if (info.type === 'weighted') {
      acc.weightedSets += 1;
      acc.tonnageKg += info.tonnageKg;
    } else if (info.type === 'bodyweight') {
      acc.bodyweightSets += 1;
    } else {
      acc.cardioSets += 1;
      acc.cardioDurationSec += info.cardioDurationSec;
    }

    return acc;
  }, { ...emptyAggregate });
}

export function getWorkoutLoadInfo(exercises: Array<{ sets: SetData[] }>): AggregateLoadInfo {
  return exercises.reduce<AggregateLoadInfo>((acc, exercise) => {
    const exerciseInfo = getSetsLoadInfo(exercise.sets);

    acc.tonnageKg += exerciseInfo.tonnageKg;
    acc.weightedSets += exerciseInfo.weightedSets;
    acc.bodyweightSets += exerciseInfo.bodyweightSets;
    acc.cardioSets += exerciseInfo.cardioSets;
    acc.cardioDurationSec += exerciseInfo.cardioDurationSec;

    return acc;
  }, { ...emptyAggregate });
}

export function getSetLoadLabel(info: SetLoadInfo): string {
  if (info.type === 'weighted') {
    return `Тоннаж: ${formatTonnageWithKg(info.tonnageKg)}`;
  }

  if (info.type === 'cardio') {
    return `Тоннаж: кардио (${formatDuration(info.cardioDurationSec)})`;
  }

  return 'Тоннаж: собственный вес';
}
