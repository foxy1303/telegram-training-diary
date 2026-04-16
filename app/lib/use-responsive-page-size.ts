'use client';

import { useEffect, useState } from 'react';

interface BreakpointPageSize {
  mobile: number;
  tablet: number;
  desktop: number;
}

export function useResponsivePageSize(config: BreakpointPageSize): number {
  const [pageSize, setPageSize] = useState(config.mobile);

  useEffect(() => {
    const updatePageSize = () => {
      const width = window.innerWidth;

      if (width >= 1024) {
        setPageSize(config.desktop);
        return;
      }

      if (width >= 768) {
        setPageSize(config.tablet);
        return;
      }

      setPageSize(config.mobile);
    };

    updatePageSize();
    window.addEventListener('resize', updatePageSize);

    return () => {
      window.removeEventListener('resize', updatePageSize);
    };
  }, [config.desktop, config.mobile, config.tablet]);

  return pageSize;
}
