'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface TrendLineChartProps {
  title: string;
  colorClassName?: string;
  valueSuffix?: string;
  labels: string[];
  values: number[];
}

export function TrendLineChart({
  title,
  colorClassName = '#2563eb',
  valueSuffix = '',
  labels,
  values,
}: TrendLineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || values.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    const min = Math.min(...values);
    const max = Math.max(...values);

    const option: echarts.EChartsOption = {
      grid: {
        top: 10,
        bottom: 20,
        left: 0,
        right: 0,
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontSize: 10,
          color: '#9ca3af',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          data: values,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: colorClassName,
          },
          lineStyle: {
            width: 3,
            color: colorClassName,
          },
          emphasis: {
            focus: 'series',
          },
        },
      ],
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (!Array.isArray(params) && params.value !== undefined) {
            return `${params.name}: ${params.value}${valueSuffix}`;
          }
          return '';
        },
      },
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [labels, values, colorClassName, valueSuffix]);

  if (values.length === 0) {
    return null;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="font-medium text-gray-900 dark:text-white">{title}</p>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Мин: {min}{valueSuffix} · Макс: {max}{valueSuffix}
        </span>
      </div>
      <div ref={chartRef} className="w-full h-44" />
      <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{labels[0]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
}
