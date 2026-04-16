'use client';

import type { Workout } from '../types';

interface DifficultyBadgeProps {
  difficulty: Workout['difficulty'];
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const colors = {
    beginner: 'bg-green-500',
    intermediate: 'bg-yellow-500',
    advanced: 'bg-red-500',
  };

  const labels = {
    beginner: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
  };

  return (
    <span className={`${colors[difficulty]} text-white text-xs px-2 py-1 rounded-full`}>
      {labels[difficulty]}
    </span>
  );
}
