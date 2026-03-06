import React, { useState, useEffect } from 'react';
import './TradingBot.css';

const TradingBot = ({ onNewTrade, onReset, totalProfit }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [stake, setStake] = useState(10);
  const [stopLoss, setStopLoss] = useState(100);
  const [takeProfit, setTakeProfit] = useState(200);
  const [pair, setPair] = useState('R_50');
  const [intervalId, setIntervalId] = useState(null);
  
  const [digitFrequency, setDigitFrequency] = useState({
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  });
  const [targetDigit, setTargetDigit] = useState(5);
  const [totalDigitsAnalyzed, setTotalDigitsAnalyzed] = useState(0);

  const pairs = [
    { symbol: 'R_10', name: 'Volatility 10 Index' },
    { symbol: 'R_25', name: 'Volatility 25 Index' },
    { symbol: 'R_50', name: 'Volatility 50 Index' },
    { symbol: 'R_75', name: 'Volatility 75 Index' },
    { symbol: 'R_100', name: 'Volatility 100 Index' },
    { symbol: 'BOOM500', name: 'Boom 500 Index' },
    { symbol: 'CRASH500', name: 'Crash 500 Index' },
    { symbol: 'STEPINDEX', name: 'Step Index' }
  ];

  const analyzeAndChooseTarget = (newDigit) => {
    setDigitFrequency(prev => {
      const updated = { ...prev, [newDigit]: prev[newDigit] + 1 };
      
      let mostFrequent = 0;
      let highestCount = 0;
      
      Object.entries(updated).forEach(([digit, count]) => {
        if (count > highestCount) {
          highestCount = count;
          mostFrequent = parseInt(digit);
        }
      });
      
      const availableDigits = [0,1,2,3,4,5,6,7,8,9].filter(d => d !== mostFrequent);
      const newTarget = availableDigits[Math.floor(Math.random() * availableDigits.length)];
      
      setTargetDigit(newTarget);
      setTotalDigitsAnalyzed(prev => prev + 1);
      
      return updated;
    });
  };

  const getTradeSignal = (currentPrice) => {
    const priceStr = currentPrice.toString();
    const lastDigit = parseInt(priceStr[priceStr.length - 1]) || 0;
    
    analyzeAndChooseTarget(lastDigit);
    
    const diff = Math.abs(lastDigit - targetDigit);
    
    if (diff <= 2) {
      return { action: 'BUY', confidence: 'HIGH', reason: `Digit ${lastDigit} close to target ${targetDigit}` };
    } else if (diff >= 7) {
      return { action: 'SELL', confidence: 'HIGH', reason: `Digit ${lastDigit} far from target ${targetDigit}` };
    } else {
      return { action: 'WAIT', confidence: 'LOW', reason: `Digit ${lastDigit} in neutral zone` };
    }
  };

  const executeTrade = () => {
    const currentPrice = 1000 + (Math.random() * 100);
    
    const signal = getTradeSignal(currentPrice);
    
    if (signal.action !== 'WAIT') {
      const win = Math.random() < 0.6;
      const profit = win ? stake * 0.85 : -stake * 0.95;
      
      const newTotalProfit = totalProfit + profit;
      
      if (newTotalProfit <= -stopLoss) {
        alert(`🔴 STOP LOSS! Loss: $${newTotalProfit.toFixed(2)}`);
        stopBot();
        return;
      }
      
      if (newTotalProfit >= takeProfit) {
        alert(`🟢 TAKE PROFIT! Profit: $${newTotalProfit.toFixed(2)}`);
        stopBot();
        return;
      }
      
      const trade = {
        id: Date.now() + Math.random(),
        pair,
        direction: signal.action,
        stake,
        profit,
        status: win ? 'WIN' : 'LOSS',
        timestamp: new Date().toISOString(),
        digit: parseInt(currentPrice.toString().slice(-1)),
        targetDigit: targetDigit,
        signal: signal.reason
      };
      
      onNewTrade(trade);
    }
  };

  const startBot = () => {
    if (isRunning) return;
    
    setDigitFrequency({0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0});
    setTotalDigitsAnalyzed(0);
    
    const id = setInterval(executeTrade, 3000);
    setIntervalId(id);
    setIsRunning(true);
  };

  const stopBot = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <div className="trading-bot-card">
      <h2>🤖 Bot Controls</h2>
      
      <div className="control-group">
        <label>Trading Pair</label>
        <select value={pair} onChange={(e) => setPair(e.target.value)}>
          {pairs.map(p => (
            <option key={p.symbol} value={p.symbol}>
              {p.name} ({p.symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label>Stake Amount ($)</label>
        <input 
          type="number" 
          value={stake}
          onChange={(e) => setStake(parseFloat(e.target.value))}
          min="1"
          step="1"
        />
      </div>

      <div className="control-row">
        <div className="control-group half">
          <label>Stop Loss ($)</label>
          <input 
            type="number" 
            value={stopLoss}
            onChange={(e) => setStopLoss(parseFloat(e.target.value))}
            min="10"
            step="10"
          />
        </div>

        <div className="control-group half">
          <label>Take Profit ($)</label>
          <input 
            type="number" 
            value={takeProfit}
            onChange={(e) => setTakeProfit(parseFloat(e.target.value))}
            min="10"
            step="10"
          />
        </div>
      </div>

      <div className="strategy-info">
        <h3>🎯 Active Strategy</h3>
        <div className="target-display">
          <span className="target-label">Current Target Digit:</span>
          <span className="target-value">{targetDigit}</span>
        </div>
        <p className="strategy-description">
          Bot analyzes digit frequency and trades AGAINST the most common digit
        </p>
        <div className="digit-stats">
          <h4>Digit Frequency (Last {totalDigitsAnalyzed} digits)</h4>
          <div className="frequency-grid">
            {Object.entries(digitFrequency).map(([digit, count]) => (
              <div key={digit} className="frequency-item">
                <span className="digit">{digit}</span>
                <div className="bar-container">
                  <div 
                    className="frequency-bar"
                    style={{
                      width: `${totalDigitsAnalyzed > 0 ? (count / totalDigitsAnalyzed) * 100 : 0}%`,
                      background: parseInt(digit) === targetDigit ? '#4CAF50' : '#764ba2'
                    }}
                  />
                </div>
                <span className="count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="button-group">
        {!isRunning ? (
          <>
            <button className="start-btn" onClick={startBot}>
              ▶ Start Bot
            </button>
            <button className="reset-btn" onClick={onReset}>
              🔄 Reset Stats
            </button>
          </>
        ) : (
          <button className="stop-btn" onClick={stopBot}>
            ⏹ Stop Bot
          </button>
        )}
      </div>

      {isRunning && (
        <div className="status-indicator">
          <span className="pulse"></span>
          Bot is running - Analyzing digits and trading...
        </div>
      )}
    </div>
  );
};

export default TradingBot;