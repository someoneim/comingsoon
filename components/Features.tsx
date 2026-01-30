import React, { useState, useEffect, useRef, useCallback } from 'react';

// Game Constants
const CANVAS_HEIGHT = 400;
const PLAYER_SIZE = 30;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_HEIGHT = 80;
const GRAVITY_SPEED = 15; // How fast player switches lanes
const INITIAL_SPEED = 5;
const MAX_SPEED = 15;
const SPEED_INCREMENT = 0.001;

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'obstacle' | 'particle';
  color?: string;
  vx?: number;
  vy?: number;
  life?: number;
}

const NeonDash: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Game State Refs
  const playerRef = useRef({
    x: 100,
    y: 200,
    targetY: 200, // Bottom lane (ground) or Top lane (ceiling)
    lane: 'bottom' as 'top' | 'bottom',
    color: '#00ffff'
  });

  const gameStateRef = useRef({
    speed: INITIAL_SPEED,
    obstacles: [] as GameObject[],
    particles: [] as GameObject[],
    lastObstacleTime: 0,
    frameCount: 0,
    score: 0
  });

  const reqRef = useRef<number | null>(null);

  // Initialize Game
  const initGame = useCallback(() => {
    if (!canvasRef.current) return;

    // Reset State
    playerRef.current = {
      x: 50,
      y: canvasRef.current.height - PLAYER_SIZE - 20,
      targetY: canvasRef.current.height - PLAYER_SIZE - 20,
      lane: 'bottom',
      color: '#00ffff'
    };

    gameStateRef.current = {
      speed: INITIAL_SPEED,
      obstacles: [],
      particles: [],
      lastObstacleTime: 0,
      frameCount: 0,
      score: 0
    };

    setScore(0);
    setGameOver(false);
    setGameStarted(true);

    // Start Loop
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    reqRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const switchGravity = useCallback(() => {
    if (!gameStarted || gameOver || !canvasRef.current) return;

    // Toggle Lane
    const canvas = canvasRef.current;
    const topLaneY = 20;
    const bottomLaneY = canvas.height - PLAYER_SIZE - 20;

    if (playerRef.current.lane === 'bottom') {
      playerRef.current.lane = 'top';
      playerRef.current.targetY = topLaneY;
    } else {
      playerRef.current.lane = 'bottom';
      playerRef.current.targetY = bottomLaneY;
    }

    // Add particles for effect
    for (let i = 0; i < 10; i++) {
      gameStateRef.current.particles.push({
        x: playerRef.current.x + PLAYER_SIZE / 2,
        y: playerRef.current.y + PLAYER_SIZE / 2,
        width: 2 + Math.random() * 3,
        height: 2 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 20,
        color: '#ffffff',
        type: 'particle'
      });
    }

  }, [gameStarted, gameOver]);

  // Main Game Loop
  const gameLoop = useCallback((timestamp: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- UPDATE ---

    // 1. Player Physics (Lerp to target Y)
    const dy = playerRef.current.targetY - playerRef.current.y;
    playerRef.current.y += dy * 0.2; // Smooth transition

    // 2. Game Speed & Score
    gameStateRef.current.speed = Math.min(MAX_SPEED, gameStateRef.current.speed + SPEED_INCREMENT);
    gameStateRef.current.score += gameStateRef.current.speed * 0.1;
    gameStateRef.current.frameCount++;

    // Update React State occasionally to avoid re-renders
    if (gameStateRef.current.frameCount % 10 === 0) {
      setScore(Math.floor(gameStateRef.current.score));
    }

    // 3. Spawner
    // Min distance between obstacles depends on speed
    const minObstacleGap = 400 + (gameStateRef.current.speed * 20);
    const lastObstacle = gameStateRef.current.obstacles[gameStateRef.current.obstacles.length - 1];

    if (!lastObstacle || (canvas.width - lastObstacle.x > minObstacleGap)) {
      // Chance to spawn
      if (Math.random() < 0.05 + (gameStateRef.current.speed * 0.001)) {
        const lane = Math.random() > 0.5 ? 'top' : 'bottom';
        const y = lane === 'top' ? 20 : canvas.height - OBSTACLE_HEIGHT - 20;

        gameStateRef.current.obstacles.push({
          x: canvas.width,
          y: y,
          width: OBSTACLE_WIDTH,
          height: OBSTACLE_HEIGHT,
          type: 'obstacle',
          color: lane === 'top' ? '#ff003c' : '#bd00ff'
        });
      }
    }

    // 4. Move Entities
    gameStateRef.current.obstacles.forEach(obs => {
      obs.x -= gameStateRef.current.speed;
    });

    // Remove off-screen
    gameStateRef.current.obstacles = gameStateRef.current.obstacles.filter(obs => obs.x + obs.width > 0);

    // Particles
    gameStateRef.current.particles.forEach(p => {
      if (p.x !== undefined && p.y !== undefined && p.vx !== undefined && p.vy !== undefined && p.life !== undefined) {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
      }
    });
    gameStateRef.current.particles = gameStateRef.current.particles.filter(p => (p.life || 0) > 0);


    // 5. Collisions
    const playerRect = {
      l: playerRef.current.x + 5, // Hitbox padding
      r: playerRef.current.x + PLAYER_SIZE - 5,
      t: playerRef.current.y + 5,
      b: playerRef.current.y + PLAYER_SIZE - 5
    };

    for (const obs of gameStateRef.current.obstacles) {
      if (
        playerRect.l < obs.x + obs.width &&
        playerRect.r > obs.x &&
        playerRect.t < obs.y + obs.height &&
        playerRect.b > obs.y
      ) {
        // Collision!
        handleGameOver();
        return; // Stop Loop
      }
    }

    // --- DRAW ---

    // Clear
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Floor/Ceiling
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, 20); // Ceiling
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20); // Floor

    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(0, 20); ctx.lineTo(canvas.width, 20);
    ctx.moveTo(0, canvas.height - 20); ctx.lineTo(canvas.width, canvas.height - 20);
    ctx.stroke();

    // Draw Particles
    gameStateRef.current.particles.forEach(p => {
      ctx.fillStyle = p.color || '#fff';
      ctx.globalAlpha = (p.life || 0) / 20;
      ctx.fillRect(p.x, p.y, p.width, p.height);
      ctx.globalAlpha = 1.0;
    });

    // Draw Obstacles
    gameStateRef.current.obstacles.forEach(obs => {
      ctx.fillStyle = obs.color || '#fff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = obs.color || '#fff';
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      ctx.shadowBlur = 0;
    });

    // Draw Player
    ctx.shadowBlur = 20;
    ctx.shadowColor = playerRef.current.color;
    ctx.fillStyle = playerRef.current.color;
    ctx.fillRect(playerRef.current.x, playerRef.current.y, PLAYER_SIZE, PLAYER_SIZE);

    // Trail Effect
    ctx.fillStyle = playerRef.current.color;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(playerRef.current.x - 10, playerRef.current.y + (playerRef.current.targetY - playerRef.current.y) * 0.1, PLAYER_SIZE, PLAYER_SIZE);
    ctx.globalAlpha = 0.1;
    ctx.fillRect(playerRef.current.x - 20, playerRef.current.y + (playerRef.current.targetY - playerRef.current.y) * 0.2, PLAYER_SIZE, PLAYER_SIZE);
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;


    reqRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const handleGameOver = () => {
    setGameOver(true);
    setGameStarted(false);
    setHighScore(h => Math.max(h, Math.floor(gameStateRef.current.score)));
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
  };

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!gameStarted && !gameOver) initGame();
        else if (gameOver) initGame();
        else switchGravity();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, initGame, switchGravity]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  // Responsive Canvas
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = CANVAS_HEIGHT;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="w-full bg-black py-16 px-4 flex flex-col items-center justify-center font-mono select-none"
      onTouchStart={(e) => {
        // Mobile Touch to Jump/Start
        if (!gameStarted && !gameOver) initGame();
        else if (gameOver) initGame();
        else switchGravity();
      }}
    >
      <div ref={containerRef} className="w-full max-w-4xl border border-white/10 p-2 relative bg-[#050505] shadow-[0_0_50px_rgba(0,0,0,0.5)]">

        {/* HUD */}
        <div className="absolute top-6 right-6 z-10 text-right">
          <div className="text-[10px] text-white/40 tracking-widest uppercase">DISTANCE</div>
          <div className="text-2xl text-white font-bold italic tracking-widest">
            {score.toString().padStart(5, '0')}m
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="block w-full h-[400px] cursor-pointer touch-none bg-[#050505]"
        />

        {/* Overlays */}
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
            <div className="mb-4 text-xl md:text-2xl text-[#ff00ff] font-bold tracking-[0.3em] uppercase animate-bounce drop-shadow-[0_0_10px_rgba(255,0,255,0.8)] font-mono">
              HII IBRU
            </div>
            <h3 className="text-4xl md:text-6xl text-white font-black italic tracking-tighter mb-4 -skew-x-12">
              NEON <span className="text-[#00ffff]">DASH</span>
            </h3>
            <div className="px-8 py-4 border-2 border-[#00ffff] text-[#00ffff] tracking-[0.2em] font-bold uppercase animate-pulse">
              TAP TO START
            </div>
            <p className="mt-8 text-xs text-white/50 tracking-widest">
              TAP OR SPACEBAR TO SWITCH GRAVITY
            </p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/40 backdrop-blur-md z-20">
            <h3 className="text-5xl md:text-7xl text-[#ff003c] font-black italic tracking-tighter mb-2 -skew-x-12 text-shadow-neon">
              CRASHED
            </h3>
            <div className="text-xl text-white tracking-widest mb-8">
              SCORE: {Math.floor(score)}m
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); initGame(); }}
              className="px-8 py-3 bg-white text-black hover:bg-[#00ffff] transition-colors font-bold tracking-[0.2em] uppercase text-sm"
            >
              RETRY
            </button>
          </div>
        )}

        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] z-30 bg-[length:100%_4px] opacity-20"></div>
      </div>

      {/* Mobile controls hint */}
      <div className="mt-4 text-[10px] text-white/20 tracking-widest md:hidden">
        TAP SCREEN TO FLIP GRAVITY
      </div>
    </div>
  );
};

export default NeonDash;
