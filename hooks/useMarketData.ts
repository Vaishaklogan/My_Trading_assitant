"use client";
import { useState, useEffect } from 'react';

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function useMarketData(initialPrice: number = 1.0924) {
  const [initialData, setInitialData] = useState<Candle[]>([]);
  const [liveTick, setLiveTick] = useState<Candle | null>(null);

  useEffect(() => {
    const history: Candle[] = [];
    let price = initialPrice;
    const now = Math.floor(Date.now() / 1000);
    // start exactly on minute intervals
    let time = (now - (now % 60)) - 100 * 60;

    for (let i = 0; i < 100; i++) {
        const volatility = 0.0005;
        const open = price;
        const close = open + (Math.random() - 0.5) * volatility;
        const high = Math.max(open, close) + Math.random() * 0.0002;
        const low = Math.min(open, close) - Math.random() * 0.0002;
        
        history.push({ time: time as any, open, high, low, close });
        price = close;
        time += 60;
    }
    
    setInitialData(history);
    
    let currentCandle = { ...history[history.length - 1] };
    
    const interval = setInterval(() => {
        const currentNow = Math.floor(Date.now() / 1000);
        const volatility = 0.00005; 
        
        // If 60 seconds have passed, roll over to new candle
        if (currentNow - currentCandle.time >= 60) {
            currentCandle = {
                time: (currentNow - (currentNow % 60)) as any,
                open: currentCandle.close,
                high: currentCandle.close,
                low: currentCandle.close,
                close: currentCandle.close
            };
        }
        
        const tickMove = (Math.random() - 0.5) * volatility;
        currentCandle.close += tickMove;
        if (currentCandle.close > currentCandle.high) currentCandle.high = currentCandle.close;
        if (currentCandle.close < currentCandle.low) currentCandle.low = currentCandle.close;
        
        setLiveTick({ ...currentCandle });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialPrice]);

  return { initialData, liveTick };
}
