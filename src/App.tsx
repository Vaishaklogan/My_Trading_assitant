import { useState } from 'react';
import './App.css';
import { useMarketData } from './hooks/useMarketData';
import { TradingChart } from './components/TradingChart';

function App() {
  const [balance] = useState(10000.00);
  const { initialData, liveTick } = useMarketData(1.0924);

  const currentPrice = liveTick ? liveTick.close.toFixed(5) : '1.09240';
  const isPositive = liveTick ? liveTick.close >= liveTick.open : true;

  return (
    <div className="app-container">
      <nav className="topbar">
        <div className="logo">TJR AI <span className="tag">PRO</span></div>
        <div className="paper-trading">
          Demo Balance: <span className="balance">${balance.toFixed(2)}</span>
        </div>
      </nav>
      
      <main className="main-content">
        <aside className="sidebar">
          <ul className="nav-links">
            <li className="active">Dashboard</li>
            <li>Markets</li>
            <li>History</li>
            <li>AI Strategy log</li>
          </ul>
        </aside>
        
        <section className="chart-area">
          <header className="ticker-bar">
            <h1>EUR/USD <span className={`price ${isPositive ? 'positive' : 'negative'}`}>{currentPrice}</span></h1>
          </header>
          <div className="chart-placeholder">
             {initialData.length > 0 ? (
                <TradingChart data={initialData as any} currentTick={liveTick as any} />
             ) : (
                <div style={{color: 'var(--text-muted)'}}>Live Chart Initializing...</div>
             )}
          </div>
        </section>

        <aside className="signal-panel">
          <h2>AI Signal Advisor</h2>
          <div className="signal-card positive">
             <h3>BUY SIGNAL</h3>
             <p>RSI Oversold, fast EMA crossing above slow EMA.</p>
             <button className="trade-btn buy-btn">Buy Now</button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
