import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import type { ISeriesApi, CandlestickData } from 'lightweight-charts';

interface TradingChartProps {
  data: CandlestickData[];
  currentTick: CandlestickData | null;
}

export const TradingChart: React.FC<TradingChartProps> = ({ data, currentTick }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#8d95a2',
      },
      grid: {
        vertLines: { color: '#2a2e39' },
        horzLines: { color: '#2a2e39' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = (chart as any).addCandlestickSeries({
      upColor: '#00ffaa',
      downColor: '#ff3366',
      borderVisible: false,
      wickUpColor: '#00ffaa',
      wickDownColor: '#ff3366',
    });

    candlestickSeries.setData(data);
    candlestickSeriesRef.current = candlestickSeries;

    const handleResize = () => {
      chart.applyOptions({ 
        width: chartContainerRef.current?.clientWidth,
        height: chartContainerRef.current?.clientHeight, 
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  useEffect(() => {
    if (candlestickSeriesRef.current && currentTick) {
        candlestickSeriesRef.current.update(currentTick as any);
    }
  }, [currentTick]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />;
};
