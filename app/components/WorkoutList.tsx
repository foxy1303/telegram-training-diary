'use client';

import { useRouter } from 'next/navigation';
import type { Workout } from '../types';
import { WorkoutCard } from './WorkoutCard';

interface WorkoutListProps {
  workouts: Workout[];
}

export function WorkoutList({ workouts }: WorkoutListProps) {
  const router = useRouter();

  const handleWorkoutClick = (workout: Workout) => {
    router.push(`/workout/${workout.id}?from=workouts`);
  };

  const handleWorkoutEdit = (workout: Workout) => {
    router.push(`/workouts/${workout.id}/edit`);
  };

  if (workouts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Тренировок пока нет
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          onClick={handleWorkoutClick}
          onEdit={handleWorkoutEdit}
        />
      ))}
    </div>
  );
}
