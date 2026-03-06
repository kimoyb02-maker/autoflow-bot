import React from 'react';
import './TradeBubbles.css';

const TradeBubbles = ({ trades }) => {
  const getBubbleColor = (status) => {
    return status === 'WIN' 
      ? 'linear-gradient(135deg, #4CAF50, #45a049)'
      : 'linear-gradient(135deg, #f44336, #d32f2f)';
  };

  return (
    <div className="trade-bubbles-container">
      <h2>📊 Live Trade Bubbles</h2>
      
      <div className="bubbles-grid">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="trade-bubble"
            style={{ background: getBubbleColor(trade.status) }}
          >
            <span className="bubble-icon">
              {trade.status === 'WIN' ? '💰' : '📉'}
            </span>
            <div className="bubble-tooltip">
              <p><strong>Pair:</strong> {trade.pair}</p>
              <p><strong>Direction:</strong> {trade.direction}</p>
              <p><strong>Digit:</strong> {trade.digit}</p>
              <p><strong>Target:</strong> {trade.targetDigit}</p>
              <p><strong>Profit:</strong> ${trade.profit?.toFixed(2)}</p>
              <p><strong>Time:</strong> {new Date(trade.timestamp).toLocaleTimeString()}</p>
              <p><small>{trade.signal}</small></p>
            </div>
          </div>
        ))}
      </div>

      {trades.length === 0 && (
        <div className="no-trades">
          <p>No trades yet. Start the bot to begin trading!</p>
          <p className="hint">Green = Win | Red = Loss | Hover for details</p>
        </div>
      )}
    </div>
  );
};

export default TradeBubbles;