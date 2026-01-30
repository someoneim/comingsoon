import React, { useState, useEffect, useRef, useCallback } from 'react';

// Game Constants
const GRID_SIZE = 20;
const GAME_SPEED = 100;
const NEON_GREEN = '#00ff41'; // Matrix/Cyber green
const NEON_RED = '#ff003c';   // Cyberpunk red
const DARK_BG = '#050505';

interface Point {
  x: number;
  y: number;
}

const Features: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Game State Refs
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Point>({ x: 15, y: 15 });
  const directionRef = useRef<Point>({ x: 0, y: 0 });
  const nextDirectionRef = useRef<Point>({ x: 0, y: 0 });
  const gameLoopRef = useRef<number | null>(null);

  // Initialize Game
  const initGame = useCallback(() => {
    if (!canvasRef.current) return;
    const cols = Math.floor(canvasRef.current.width / GRID_SIZE);
    const rows = Math.floor(canvasRef.current.height / GRID_SIZE);

    snakeRef.current = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
    foodRef.current = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows)
    };
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  }, []);

  // Handle Input Direction
  const changeDirection = useCallback((x: number, y: number) => {
    if (!gameStarted) return;
    // Prevent reversing directly
    if (x !== 0 && directionRef.current.x === 0) nextDirectionRef.current = { x, y: 0 };
    if (y !== 0 && directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y };
  }, [gameStarted]);

  // Game Loop
  const gameLoop = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cols = canvas.width / GRID_SIZE;
    const rows = canvas.height / GRID_SIZE;

    // Update Direction
    directionRef.current = nextDirectionRef.current;

    // Move Snake
    const head = { ...snakeRef.current[0] };
    head.x += directionRef.current.x;
    head.y += directionRef.current.y;

    // Check Collisions (Walls)
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
      setGameOver(true);
      setGameStarted(false);
      return;
    }

    // Check Collisions (Self)
    for (const segment of snakeRef.current) {
      if (head.x === segment.x && head.y === segment.y) {
        setGameOver(true);
        setGameStarted(false);
        return;
      }
    }

    const newSnake = [head, ...snakeRef.current];

    // Check Food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(s => {
        const newScore = s + 10;
        setHighScore(h => Math.max(h, newScore));
        return newScore;
      });
      // Spawn new food not on snake
      let newFood;
      let tries = 0;
      do {
        newFood = {
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows)
        };
        tries++;
      } while (newSnake.some(s => s.x === newFood.x && s.y === newFood.y) && tries < 100);
      foodRef.current = newFood;
    } else {
      newSnake.pop(); // Remove tail
    }

    snakeRef.current = newSnake;

    // Draw
    ctx.fillStyle = DARK_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Responsive)
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(canvas.width, i * GRID_SIZE);
      ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = NEON_RED;
    ctx.shadowBlur = 15;
    ctx.shadowColor = NEON_RED;
    ctx.beginPath();
    ctx.arc(
      foodRef.current.x * GRID_SIZE + GRID_SIZE / 2,
      foodRef.current.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    newSnake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#ffffff' : NEON_GREEN;
      ctx.shadowBlur = isHead ? 0 : 10;
      ctx.shadowColor = NEON_GREEN;

      ctx.fillRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
    });
    ctx.shadowBlur = 0;

  }, []);

  // Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      // Prevent page scrolling with arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp': changeDirection(0, -1); break;
        case 'ArrowDown': changeDirection(0, 1); break;
        case 'ArrowLeft': changeDirection(-1, 0); break;
        case 'ArrowRight': changeDirection(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, changeDirection]);

  // Mobile Detection & Resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (containerRef.current && canvasRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Calculate max cols that fit
        const cols = Math.floor(containerWidth / GRID_SIZE);
        // Aspect ratio roughly 2:1 or square on mobile
        const desiredRows = window.innerWidth < 768 ? 20 : 25;

        canvasRef.current.width = cols * GRID_SIZE;
        canvasRef.current.height = desiredRows * GRID_SIZE;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Game Loop Interval
  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = window.setInterval(gameLoop, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, gameLoop]);

  // D-Pad Component
  const DPad = () => (
    <div className="mt-8 grid grid-cols-3 gap-2 w-48 mx-auto touch-none select-none">
      <div />
      <button
        className="w-14 h-14 bg-white/5 border border-white/20 rounded-lg active:bg-[#00ff41]/20 active:border-[#00ff41] flex items-center justify-center transition-all"
        onPointerDown={(e) => { e.preventDefault(); changeDirection(0, -1); }}
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
      </button>
      <div />

      <button
        className="w-14 h-14 bg-white/5 border border-white/20 rounded-lg active:bg-[#00ff41]/20 active:border-[#00ff41] flex items-center justify-center transition-all"
        onPointerDown={(e) => { e.preventDefault(); changeDirection(-1, 0); }}
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div className="w-14 h-14 flex items-center justify-center">
        <div className="w-2 h-2 bg-white/10 rounded-full" />
      </div>
      <button
        className="w-14 h-14 bg-white/5 border border-white/20 rounded-lg active:bg-[#00ff41]/20 active:border-[#00ff41] flex items-center justify-center transition-all"
        onPointerDown={(e) => { e.preventDefault(); changeDirection(1, 0); }}
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      <div />
      <button
        className="w-14 h-14 bg-white/5 border border-white/20 rounded-lg active:bg-[#00ff41]/20 active:border-[#00ff41] flex items-center justify-center transition-all"
        onPointerDown={(e) => { e.preventDefault(); changeDirection(0, 1); }}
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div />
    </div>
  );

  return (
    <div className="w-full bg-black py-16 px-4 flex flex-col items-center justify-center font-mono">
      <div ref={containerRef} className="w-full max-w-4xl border border-white/10 p-4 relative bg-[#050505] shadow-[0_0_50px_rgba(0,0,0,0.5)]">

        {/* Header */}
        <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl md:text-2xl text-white font-light tracking-[0.2em] uppercase">
              Protocol <span className="text-[#00ff41]">Snake</span>
            </h2>
            <p className="text-[10px] text-white/40 tracking-widest mt-1 hidden sm:block">SYSTEM WAITING...</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40 tracking-widest uppercase">Score / High</p>
            <div className="text-xl md:text-3xl text-white font-bold">
              {score.toString().padStart(3, '0')} <span className="text-white/20">/</span> {highScore.toString().padStart(3, '0')}
            </div>
          </div>
        </div>

        {/* Game Container */}
        <div className="relative w-full flex justify-center bg-[#0a0a0a] border border-white/5 overflow-hidden group">
          <canvas
            ref={canvasRef}
            className="block outline-none touch-none"
          />

          {/* Overlays */}
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10 px-4 text-center">
              <h3 className="text-2xl md:text-4xl text-white font-light tracking-[0.5em] mb-8 animate-pulse">INITIATE</h3>
              <button
                onClick={initGame}
                className="px-6 py-3 md:px-8 md:py-3 border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-all duration-300 tracking-[0.3em] uppercase text-xs"
              >
                Start System
              </button>
              <p className="mt-8 text-[10px] text-white/30 tracking-widest hidden md:block">
                USE ARROW KEYS
              </p>
              <p className="mt-8 text-[10px] text-white/30 tracking-widest md:hidden">
                TAP START TO BEGIN
              </p>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/20 backdrop-blur-sm z-10 px-4 text-center">
              <h3 className="text-3xl md:text-5xl text-[#ff003c] font-bold tracking-[0.2em] mb-4 text-shadow-neon">FAILURE</h3>
              <p className="text-white/60 tracking-widest mb-8 text-sm">CONNECTION TERMINATED</p>
              <button
                onClick={initGame}
                className="px-6 py-3 md:px-8 md:py-3 border border-white/20 hover:border-white text-white transition-all duration-300 tracking-[0.3em] uppercase text-xs bg-black"
              >
                Retry Protocol
              </button>
            </div>
          )}
        </div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] opacity-20"></div>
      </div>

      {/* Mobile Controls (Only visible on small screens) */}
      <div className="block md:hidden">
        <DPad />
      </div>
    </div>
  );
};

export default Features;
