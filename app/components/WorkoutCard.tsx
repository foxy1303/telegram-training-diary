'use client';

import type { Workout } from '../types';
import { DifficultyBadge } from './DifficultyBadge';

interface WorkoutCardProps {
  workout: Workout;
  onClick?: (workout: Workout) => void;
  onEdit?: (workout: Workout) => void;
}

export function WorkoutCard({ workout, onClick, onEdit }: WorkoutCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(workout);
  };

  return (
    <div
      onClick={() => onClick?.(workout)}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {workout.name}
        </h3>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={handleEditClick}
              className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              title="Редактировать"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
          <DifficultyBadge difficulty={workout.difficulty} />
        </div>
      </div>

      {workout.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {workout.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
        {workout.duration && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {workout.duration} мин
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          {workout.exercises.length} упр.
        </span>
      </div>

      {workout.tags && workout.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {workout.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
