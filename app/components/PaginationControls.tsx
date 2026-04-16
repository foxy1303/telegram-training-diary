'use client';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      >
        Назад
      </button>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Страница {currentPage} из {totalPages}
      </p>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      >
        Вперёд
      </button>
    </div>
  );
}
