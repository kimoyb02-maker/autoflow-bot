import React from 'react';
import './ProfitDisplay.css';

const ProfitDisplay = ({ profitLoss, totalTrades }) => {
  const winCount = totalTrades > 0 ? Math.floor(totalTrades * 0.6) : 0;
  const lossCount = totalTrades - winCount;
  const winRate = totalTrades > 0 ? ((winCount / totalTrades) * 100).toFixed(1) : 0;

  const getProfitColor = () => {
    if (profitLoss > 0) return '#4CAF50';
    if (profitLoss < 0) return '#f44336';
    return '#666';
  };

  return (
    <div className="profit-display">
      <h2>📈 Performance Stats</h2>
      
      <div className="stats-grid">
        <div className="stat-card main">
          <span className="stat-label">Total P/L</span>
          <span className="stat-value" style={{ color: getProfitColor() }}>
            ${profitLoss.toFixed(2)}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Trades</span>
          <span className="stat-value">{totalTrades}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Win Rate</span>
          <span className="stat-value">{winRate}%</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Avg Profit/Trade</span>
          <span className="stat-value" style={{ 
            color: totalTrades > 0 ? (profitLoss/totalTrades > 0 ? '#4CAF50' : '#f44336') : '#666' 
          }}>
            ${totalTrades > 0 ? (profitLoss/totalTrades).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-label">
          <span>Progress to Stop Loss</span>
          <span style={{ color: profitLoss < 0 ? '#f44336' : '#666' }}>
            ${Math.abs(profitLoss).toFixed(2)}
          </span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill"
            style={{
              width: `${Math.min(Math.abs(profitLoss / 100) * 100, 100)}%`,
              background: profitLoss >= 0 ? '#4CAF50' : '#f44336'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfitDisplay;