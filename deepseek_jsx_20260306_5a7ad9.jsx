import React, { useState } from 'react';
import TradingBot from './components/TradingBot';
import TradeBubbles from './components/TradeBubbles';
import ProfitDisplay from './components/ProfitDisplay';
import './App.css';

function App() {
  const [trades, setTrades] = useState([]);
  const [profitLoss, setProfitLoss] = useState(0);
  const [totalTrades, setTotalTrades] = useState(0);

  const addTrade = (trade) => {
    setTrades(prev => [trade, ...prev].slice(0, 50));
    setProfitLoss(prev => prev + (trade.profit || 0));
    setTotalTrades(prev => prev + 1);
  };

  const resetTrades = () => {
    setTrades([]);
    setProfitLoss(0);
    setTotalTrades(0);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 Deriv Automatic Digit Bot</h1>
        <p>Smart Strategy - Trades Against Most Frequent Digits</p>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <TradingBot 
            onNewTrade={addTrade} 
            onReset={resetTrades}
            totalProfit={profitLoss}
          />
          <ProfitDisplay profitLoss={profitLoss} totalTrades={totalTrades} />
        </div>

        <div className="right-panel">
          <TradeBubbles trades={trades} />
        </div>
      </main>
    </div>
  );
}

export default App;