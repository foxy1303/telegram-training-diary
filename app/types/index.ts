export interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscleGroup?: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'other';
}

export interface SetData {
  reps: number;
  weight?: number;
  duration?: number; // for exercises like planks, in seconds
  rpe?: number;
  comment?: string;
  completed?: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: SetData[]; // each set can have different reps and weight
}

export interface Workout {
  id: string;
  name: string;
  workoutDate?: string; // YYYY-MM-DD, optional planned/performed date
  description?: string;
  exercises: WorkoutExercise[];
  duration?: number; // estimated duration in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  createdAt: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  sourceWorkoutId?: string;
}

export interface WorkoutDraftData {
  name: string;
  workoutDate?: string;
  description?: string;
  exercises: WorkoutExercise[];
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutId: string;
  exercises: WorkoutExercise[]; // completed exercises with actual performance
  startTime: string;
  endTime?: string;
  rating?: number; // 1-5 stars
  notes?: string;
}
