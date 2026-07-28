import React, { useState, useEffect } from 'react';
import { Target, Zap, RotateCcw } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import confetti from 'canvas-confetti';

export const PenaltyShootout: React.FC = () => {
  const [userScore, setUserScore] = useState(0);
  const [keeperScore, setKeeperScore] = useState(0);
  const [kicksTaken, setKicksTaken] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 30 }); // percent 0-100 inside goal
  const [power, setPower] = useState(60);
  const [powerDirection, setPowerDirection] = useState(1);
  const [isCharging, setIsCharging] = useState(false);
  const [kickResult, setKickResult] = useState<'idle' | 'shooting' | 'goal' | 'saved' | 'missed'>('idle');
  const [keeperTarget, setKeeperTarget] = useState({ x: 50, y: 30 });
  const [history, setHistory] = useState<('goal' | 'saved' | 'missed')[]>([]);

  // Power meter animation loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isCharging) {
      interval = setInterval(() => {
        setPower(prev => {
          let next = prev + powerDirection * 4;
          if (next >= 100) {
            next = 100;
            setPowerDirection(-1);
          } else if (next <= 10) {
            next = 10;
            setPowerDirection(1);
          }
          return next;
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isCharging, powerDirection]);

  const handleTargetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (kickResult === 'shooting') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTargetPos({ x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) });
  };

  const handleShoot = () => {
    if (kickResult === 'shooting') return;

    if (!isCharging) {
      // Start charging power
      setIsCharging(true);
      return;
    }

    // Release shot!
    setIsCharging(false);
    setKickResult('shooting');
    audioEngine.playKick();

    // AI Goalkeeper dive decision
    const keeperX = 20 + Math.random() * 60;
    const keeperY = 15 + Math.random() * 60;
    setKeeperTarget({ x: keeperX, y: keeperY });

    setTimeout(() => {
      // Distance between ball target and keeper dive
      const dist = Math.sqrt(
        Math.pow(targetPos.x - keeperX, 2) + Math.pow(targetPos.y - keeperY, 2)
      );

      let res: 'goal' | 'saved' | 'missed' = 'goal';

      if (power > 95) {
        // Overpowered shot misses over the crossbar!
        res = 'missed';
        audioEngine.playWhistle();
      } else if (dist < 22) {
        // Goalkeeper saved!
        res = 'saved';
        setKeeperScore(prev => prev + 1);
        audioEngine.playWhistle();
      } else {
        // GOAL!
        res = 'goal';
        setUserScore(prev => prev + 1);
        audioEngine.playGoalHorn();
        audioEngine.playCheer();
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }

      setKickResult(res);
      setHistory(prev => [...prev, res]);
      setKicksTaken(prev => prev + 1);
    }, 800);
  };

  const resetGame = () => {
    setUserScore(0);
    setKeeperScore(0);
    setKicksTaken(0);
    setHistory([]);
    setKickResult('idle');
    setTargetPos({ x: 50, y: 30 });
    audioEngine.playClick();
  };

  return (
    <div className="penalty-container">
      {/* Header Banner */}
      <div className="penalty-header">
        <div className="penalty-title-box">
          <h2>🎯 FIFA PENALTY SHOOTOUT</h2>
          <p>Aim your shot, charge power, and outsmart the world-class goalkeeper!</p>
        </div>

        <div className="penalty-scoreboard">
          <div className="score-box user">
            <span>YOU (STRIKER)</span>
            <h3>{userScore}</h3>
          </div>
          <div className="penalty-versus">VS</div>
          <div className="score-box keeper">
            <span>GOALKEEPER</span>
            <h3>{keeperScore}</h3>
          </div>
        </div>
      </div>

      {/* Goal Interactive Viewport */}
      <div className="goal-viewport" onClick={handleTargetClick}>
        {/* Crossbar & Net Lines */}
        <div className="goal-frame">
          <div className="goal-net-grid" />
        </div>

        {/* Goalkeeper Avatar */}
        <div
          className={`keeper-avatar ${kickResult === 'shooting' || kickResult !== 'idle' ? 'diving' : ''}`}
          style={{
            left: `${kickResult === 'idle' ? 50 : keeperTarget.x}%`,
            top: `${kickResult === 'idle' ? 55 : keeperTarget.y}%`
          }}
        >
          <div className="keeper-head">🧢</div>
          <div className="keeper-body">🧤</div>
        </div>

        {/* User Shot Target Crosshair */}
        <div
          className="target-crosshair"
          style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
        >
          <Target size={32} className="target-icon" />
        </div>

        {/* Ball Animation */}
        <div
          className={`penalty-ball ${kickResult === 'shooting' ? 'ball-flying' : ''}`}
          style={{
            left: kickResult === 'idle' ? '50%' : `${targetPos.x}%`,
            top: kickResult === 'idle' ? '88%' : `${targetPos.y}%`
          }}
        >
          ⚽
        </div>

        {/* Result Overlay Banner */}
        {kickResult === 'goal' && (
          <div className="penalty-overlay-result goal">
            <h1>⚽ GOOOOOAL!</h1>
            <p>Unstoppable strike into the net!</p>
          </div>
        )}
        {kickResult === 'saved' && (
          <div className="penalty-overlay-result saved">
            <h1>🧤 SAVED BY KEEPER!</h1>
            <p>Incredible reflex save by the goalie!</p>
          </div>
        )}
        {kickResult === 'missed' && (
          <div className="penalty-overlay-result missed">
            <h1>💨 OVER THE BAR!</h1>
            <p>Too much power! The shot sailed over.</p>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="penalty-controls-grid">
        {/* Power Bar */}
        <div className="power-card">
          <div className="power-header">
            <span>⚡ SHOT POWER</span>
            <span className="power-num">{power}%</span>
          </div>
          <div className="power-bar-track">
            <div
              className={`power-bar-fill ${power > 90 ? 'overpowered' : ''}`}
              style={{ width: `${power}%` }}
            />
          </div>
          <span className="power-hint">Aim for 70%-90% power. Above 95% will miss!</span>
        </div>

        {/* Action Button */}
        <div className="shoot-action-box">
          {kickResult === 'shooting' ? (
            <button className="btn-shoot shooting" disabled>
              <Zap size={22} className="spin" /> SHOOTING...
            </button>
          ) : isCharging ? (
            <button className="btn-shoot charging" onClick={handleShoot}>
              <Zap size={22} /> RELEASE TO SHOOT ({power}%)
            </button>
          ) : (
            <button className="btn-shoot ready" onClick={handleShoot}>
              <Target size={22} /> CLICK TO CHARGE POWER
            </button>
          )}

          <button className="btn-reset-penalty" onClick={resetGame}>
            <RotateCcw size={18} /> Reset Penalty Series
          </button>
        </div>
      </div>

      {/* Kick History Dots */}
      <div className="penalty-history-card">
        <h4>Penalty History ({kicksTaken} Taken)</h4>
        <div className="history-dots">
          {history.map((h, idx) => (
            <div key={idx} className={`history-dot ${h}`}>
              {h === 'goal' ? '⚽' : h === 'saved' ? '🧤' : '❌'}
            </div>
          ))}
          {Array.from({ length: Math.max(0, 5 - history.length) }).map((_, i) => (
            <div key={i} className="history-dot empty">•</div>
          ))}
        </div>
      </div>
    </div>
  );
};
