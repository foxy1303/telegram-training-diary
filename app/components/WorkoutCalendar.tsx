'use client';

import { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import type { Workout } from '../types';

interface WorkoutCalendarProps {
  workouts: Workout[];
  onDaySelect?: (date: Date) => void;
  onWorkoutSelect?: (workoutId: string) => void;
}

export function WorkoutCalendar({ workouts, onDaySelect, onWorkoutSelect }: WorkoutCalendarProps) {
  const events = useMemo(() => {
    const toLocalDate = (dateValue: string) => {
      const date = new Date(dateValue);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    };

    return workouts.map((workout) => ({
      id: workout.id,
      title: workout.name,
      start: workout.workoutDate || toLocalDate(workout.createdAt),
      allDay: true,
    }));
  }, [workouts]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-hidden">
      <div className="fc-theme-standard w-full">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'today',
          }}
          dateClick={(arg) => {
            onDaySelect?.(new Date(arg.date));
          }}
          eventClick={(arg: EventClickArg) => {
            onWorkoutSelect?.(arg.event.id);
          }}
          events={events}
          locale="ru"
          firstDay={1}
          displayEventTime={false}
          dayMaxEvents={true}
          showNonCurrentDates={true}
          fixedWeekCount={false}
          height="auto"
          expandRows={true}
        />
      </div>

      <style jsx global>{`
        .fc {
          font-family: inherit;
        }
        .fc-theme-standard .fc-scrollgrid {
          border: none;
        }
        .fc-theme-standard td,
        .fc-theme-standard th {
          border: none;
          border-bottom: 1px solid #e5e7eb;
        }
        .dark .fc-theme-standard td,
        .dark .fc-theme-standard th {
          border-bottom: 1px solid #374151;
        }
        .fc-theme-standard td:last-child,
        .fc-theme-standard th:last-child {
          border-right: none;
        }
        .fc-col-header-cell {
          padding: 8px 4px;
        }
        .fc-col-header-cell-cushion {
          font-weight: 600;
          color: #6b7280;
          font-size: 0.875rem;
        }
        .dark .fc-col-header-cell-cushion {
          color: #9ca3af;
        }
        .fc-daygrid-day {
          padding: 4px;
        }
        .fc-button {
          font-weight: 500;
          padding: 0.5rem 1rem;
        }
        .fc-button-primary {
          border: none;
          background-color: #3b82f6;
        }
        .fc-button-primary:hover {
          background-color: #2563eb;
        }
        .fc-daygrid-event {
          font-size: 0.75rem;
          padding: 2px 4px;
        }
        .fc-event {
          border-radius: 4px !important;
          border: none !important;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
