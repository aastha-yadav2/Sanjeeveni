import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import confetti from 'canvas-confetti';

interface Entity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  name: string;
  team: 'home' | 'away';
  isKeeper?: boolean;
}

export const ArcadeMatch: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchTime, setMatchTime] = useState(0); // 0 to 90 mins
  const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'paused' | 'goal' | 'ended'>('ready');
  const [goalText, setGoalText] = useState('');
  const [commentary, setCommentary] = useState<string[]>([
    'Welcome to the FIFA 26 Pro Match Arena!',
    'Use Arrow Keys or WASD to move your player. Press SPACE to Pass/Shoot!'
  ]);

  // Keys state
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // Game object states
  const gameStateRef = useRef<{
    ball: { x: number; y: number; vx: number; vy: number; radius: number };
    players: Entity[];
    controlledIndex: number;
  }>({
    ball: { x: 400, y: 250, vx: 0, vy: 0, radius: 8 },
    players: [],
    controlledIndex: 0
  });

  // Initialize pitch & players
  const initGame = () => {
    const W = 800;
    const H = 500;
    setHomeScore(0);
    setAwayScore(0);
    setMatchTime(0);
    setGameStatus('ready');
    setCommentary([
      'Match initialized!',
      'Home Team: Blue FC vs Away Team: Red United.'
    ]);

    gameStateRef.current = {
      ball: { x: W / 2, y: H / 2, vx: 0, vy: 0, radius: 8 },
      players: [
        // Home Players (Blue)
        { x: 100, y: H / 2, vx: 0, vy: 0, radius: 14, color: '#00f2fe', name: 'User Player', team: 'home' },
        { x: 220, y: H / 3, vx: 0, vy: 0, radius: 14, color: '#00f2fe', name: 'Forward 1', team: 'home' },
        { x: 220, y: (2 * H) / 3, vx: 0, vy: 0, radius: 14, color: '#00f2fe', name: 'Forward 2', team: 'home' },
        { x: 50, y: H / 2, vx: 0, vy: 0, radius: 15, color: '#00a8ff', name: 'Home GK', team: 'home', isKeeper: true },

        // Away Players (Red)
        { x: 700, y: H / 2, vx: 0, vy: 0, radius: 15, color: '#ff4757', name: 'Away GK', team: 'away', isKeeper: true },
        { x: 580, y: H / 3, vx: 0, vy: 0, radius: 14, color: '#ff4757', name: 'Defender 1', team: 'away' },
        { x: 580, y: (2 * H) / 3, vx: 0, vy: 0, radius: 14, color: '#ff4757', name: 'Defender 2', team: 'away' },
        { x: 450, y: H / 2, vx: 0, vy: 0, radius: 14, color: '#ff4757', name: 'Striker', team: 'away' }
      ],
      controlledIndex: 0
    };
  };

  const addCommentary = (text: string) => {
    setCommentary(prev => [text, ...prev.slice(0, 5)]);
  };

  // Keyboard events
  useEffect(() => {
    initGame();

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;

      // Spacebar for pass/shoot
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        shootBall();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const shootBall = () => {
    const state = gameStateRef.current;
    const userPlayer = state.players[state.controlledIndex];
    const dx = state.ball.x - userPlayer.x;
    const dy = state.ball.y - userPlayer.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 40) {
      // Shoot towards enemy goal (x = 760, y = 250)
      const targetX = 770;
      const targetY = 250 + (Math.random() * 100 - 50);
      const angle = Math.atan2(targetY - userPlayer.y, targetX - userPlayer.x);
      const power = 14;

      state.ball.vx = Math.cos(angle) * power;
      state.ball.vy = Math.sin(angle) * power;
      audioEngine.playKick();
      addCommentary('🚀 POWER SHOT by User Player towards goal!');
    }
  };

  // Main game loop
  useEffect(() => {
    let animationFrameId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    let timeAcc = 0;

    const loop = () => {
      if (isPlaying) {
        timeAcc += 0.05;
        if (timeAcc >= 1) {
          timeAcc = 0;
          setMatchTime(prev => {
            if (prev >= 90) {
              setIsPlaying(false);
              setGameStatus('ended');
              audioEngine.playWhistle();
              addCommentary('🏁 FULL TIME! Match ended.');
              return 90;
            }
            return prev + 1;
          });
        }

        // Update physics & movement
        const state = gameStateRef.current;
        const keys = keysRef.current;
        const user = state.players[state.controlledIndex];

        // User player controls
        const speed = 4.5;
        if (keys['ArrowUp'] || keys['w'] || keys['W']) user.y -= speed;
        if (keys['ArrowDown'] || keys['s'] || keys['S']) user.y += speed;
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) user.x -= speed;
        if (keys['ArrowRight'] || keys['d'] || keys['D']) user.x += speed;

        // Keep user inside pitch
        user.x = Math.max(30, Math.min(W - 30, user.x));
        user.y = Math.max(30, Math.min(H - 30, user.y));

        // AI Players Movement
        state.players.forEach((p, idx) => {
          if (idx === state.controlledIndex) return;

          if (p.team === 'away') {
            // AI Away Team: pursue ball
            const dx = state.ball.x - p.x;
            const dy = state.ball.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 15) {
              const aiSpeed = p.isKeeper ? 2.5 : 3.2;
              p.x += (dx / dist) * aiSpeed;
              p.y += (dy / dist) * aiSpeed;
            }

            // AI Shoot if close to ball and in range
            if (dist < 22 && Math.random() < 0.05) {
              const shootAngle = Math.atan2(H / 2 - p.y, 30 - p.x);
              state.ball.vx = Math.cos(shootAngle) * 11;
              state.ball.vy = Math.sin(shootAngle) * 11;
              audioEngine.playKick();
              addCommentary('⚠️ Red United counter-attack shot!');
            }
          } else if (p.team === 'home' && !p.isKeeper) {
            // Teammate supporting
            const targetX = state.ball.x - 80;
            const targetY = state.ball.y + (idx % 2 === 0 ? 60 : -60);
            p.x += (targetX - p.x) * 0.03;
            p.y += (targetY - p.y) * 0.03;
          }
        });

        // Ball movement & friction
        state.ball.x += state.ball.vx;
        state.ball.y += state.ball.vy;
        state.ball.vx *= 0.96;
        state.ball.vy *= 0.96;

        // Player-ball collision dribble effect
        state.players.forEach(p => {
          const dx = state.ball.x - p.x;
          const dy = state.ball.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < p.radius + state.ball.radius) {
            // Light push
            state.ball.vx += (dx / (dist || 1)) * 1.5;
            state.ball.vy += (dy / (dist || 1)) * 1.5;
          }
        });

        // Pitch Boundary reflections (except goals)
        const topGoalY = 190;
        const botGoalY = 310;

        if (state.ball.y < 20 || state.ball.y > H - 20) {
          state.ball.vy = -state.ball.vy * 0.8;
          state.ball.y = Math.max(20, Math.min(H - 20, state.ball.y));
        }

        // Left Boundary / Home Goal
        if (state.ball.x < 30) {
          if (state.ball.y >= topGoalY && state.ball.y <= botGoalY) {
            // GOAL for Away Team!
            handleGoal('away');
          } else {
            state.ball.vx = -state.ball.vx * 0.8;
            state.ball.x = 30;
          }
        }

        // Right Boundary / Away Goal
        if (state.ball.x > W - 30) {
          if (state.ball.y >= topGoalY && state.ball.y <= botGoalY) {
            // GOAL for Home Team!
            handleGoal('home');
          } else {
            state.ball.vx = -state.ball.vx * 0.8;
            state.ball.x = W - 30;
          }
        }
      }

      // Draw Everything
      drawPitch(ctx, W, H);
      drawEntities(ctx);

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  const handleGoal = (scoringTeam: 'home' | 'away') => {
    setIsPlaying(false);
    audioEngine.playGoalHorn();
    audioEngine.playCheer();

    if (scoringTeam === 'home') {
      setHomeScore(prev => prev + 1);
      setGoalText('⚽ GOAL FOR BLUE FC!');
      addCommentary('🎉 SPECTACULAR GOAL by Blue FC!');
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      setAwayScore(prev => prev + 1);
      setGoalText('⚡ GOAL FOR RED UNITED!');
      addCommentary('💥 Red United strike into the net!');
    }

    setGameStatus('goal');

    // Reset positions after goal delay
    setTimeout(() => {
      const W = 800;
      const H = 500;
      gameStateRef.current.ball = { x: W / 2, y: H / 2, vx: 0, vy: 0, radius: 8 };
      setGameStatus('ready');
    }, 2500);
  };

  const drawPitch = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    // Grass background with subtle stripes
    ctx.fillStyle = '#112918';
    ctx.fillRect(0, 0, W, H);

    const stripeWidth = 50;
    for (let x = 0; x < W; x += stripeWidth * 2) {
      ctx.fillStyle = '#14331e';
      ctx.fillRect(x, 0, stripeWidth, H);
    }

    // Pitch Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 3;

    // Outer Boundary
    ctx.strokeRect(30, 20, W - 60, H - 40);

    // Halfway line
    ctx.beginPath();
    ctx.moveTo(W / 2, 20);
    ctx.lineTo(W / 2, H - 20);
    ctx.stroke();

    // Center Circle
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 60, 0, Math.PI * 2);
    ctx.stroke();

    // Center Spot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 4, 0, Math.PI * 2);
    ctx.fill();

    // Penalty Areas & Goals
    const topY = 190;
    const botY = 310;

    // Left Goal (Home Goal)
    ctx.fillStyle = 'rgba(0, 242, 254, 0.2)';
    ctx.fillRect(10, topY, 20, botY - topY);
    ctx.strokeRect(10, topY, 20, botY - topY);
    ctx.strokeRect(30, 130, 100, 240); // Penalty box

    // Right Goal (Away Goal)
    ctx.fillStyle = 'rgba(255, 71, 87, 0.2)';
    ctx.fillRect(W - 30, topY, 20, botY - topY);
    ctx.strokeRect(W - 30, topY, 20, botY - topY);
    ctx.strokeRect(W - 130, 130, 100, 240); // Penalty box
  };

  const drawEntities = (ctx: CanvasRenderingContext2D) => {
    const state = gameStateRef.current;

    // Draw Players
    state.players.forEach((p, idx) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = idx === state.controlledIndex ? '#ffe259' : '#ffffff';
      ctx.stroke();

      // Draw active player indicator ring
      if (idx === state.controlledIndex) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffe259';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Player initial
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.team === 'home' ? 'H' : 'A', p.x, p.y);
      ctx.restore();
    });

    // Draw Ball
    const b = state.ball;
    ctx.save();
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Ball pattern
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(b.x - 2, b.y - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const startKickoff = () => {
    audioEngine.playWhistle();
    setIsPlaying(true);
    setGameStatus('playing');
    addCommentary('🔔 Kick-off! The match is under way.');
  };

  const pauseMatch = () => {
    setIsPlaying(false);
    setGameStatus('paused');
    addCommentary('⏸️ Match paused.');
  };

  return (
    <div className="arcade-container">
      {/* Scoreboard Panel */}
      <div className="scoreboard-panel">
        <div className="score-team home">
          <span className="team-badge-icon">🩵</span>
          <span className="team-name">BLUE FC</span>
          <span className="score-val">{homeScore}</span>
        </div>

        <div className="match-clock-box">
          <div className="clock-time">{matchTime}' MIN</div>
          <div className="match-status-tag">
            {gameStatus === 'playing' ? 'LIVE' : gameStatus.toUpperCase()}
          </div>
        </div>

        <div className="score-team away">
          <span className="score-val">{awayScore}</span>
          <span className="team-name">RED UNITED</span>
          <span className="team-badge-icon">🔴</span>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="match-canvas"
        />

        {/* Goal Overlay */}
        {gameStatus === 'goal' && (
          <div className="goal-banner-overlay">
            <h1 className="goal-text-animated">{goalText}</h1>
          </div>
        )}

        {/* Start / Pause overlay if ready */}
        {gameStatus === 'ready' && (
          <div className="canvas-start-overlay">
            <h2 className="overlay-title">MATCH DAY ARENA</h2>
            <p className="overlay-sub">Take control of Blue FC and conquer the pitch!</p>
            <button className="btn-primary start-btn" onClick={startKickoff}>
              <Play fill="currentColor" size={20} />
              <span>START KICK-OFF</span>
            </button>
          </div>
        )}
      </div>

      {/* Control Bar & Commentary Panel */}
      <div className="match-bottom-grid">
        <div className="controls-card">
          <h4>🎮 Match Controls</h4>
          <div className="controls-btn-group">
            {!isPlaying ? (
              <button className="btn-action play" onClick={startKickoff}>
                <Play size={18} /> Resume
              </button>
            ) : (
              <button className="btn-action pause" onClick={pauseMatch}>
                <Pause size={18} /> Pause
              </button>
            )}

            <button className="btn-action reset" onClick={initGame}>
              <RotateCcw size={18} /> Reset Pitch
            </button>

            <button className="btn-action shoot" onClick={shootBall}>
              <Zap size={18} /> Shoot / Pass (SPACE)
            </button>
          </div>

          <div className="keyboard-instructions">
            <div className="key-badge">⬆️ ⬇️ ⬅️ ➡️ / W A S D</div>
            <span>Move Player</span>
            <div className="key-badge">SPACE</div>
            <span>Power Shoot / Pass</span>
          </div>
        </div>

        {/* Commentary Ticker */}
        <div className="commentary-card">
          <h4>🎙️ Live Stadium Commentary</h4>
          <div className="commentary-feed">
            {commentary.map((line, idx) => (
              <div key={idx} className="commentary-line">
                <span className="commentary-bullet">▶</span> {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
