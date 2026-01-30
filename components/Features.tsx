import React, { useState, useEffect, useRef, useCallback } from 'react';

// Game Constants
const GRID_SIZE = 5; // 5x5 Grid
const INITIAL_SPAWN_RATE = 1000;
const MIN_SPAWN_RATE = 400;
const ACTIVE_TIMEOUT = 2000; // Time before active becomes corrupted
const MAX_CORRUPTION = 3;

type NodeStatus = 'idle' | 'active' | 'corrupted';

interface GridNode {
  id: number;
  status: NodeStatus;
}

const QuantumGrid: React.FC = () => {
  const [grid, setGrid] = useState<GridNode[]>(
    Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({ id: i, status: 'idle' }))
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [corruption, setCorruption] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);

  const spawnTimerRef = useRef<number | null>(null);
  const activeTimersRef = useRef<Record<number, number>>({});

  // Sound Effects (Web Audio API or simple placeholder - visual only for now)

  // Game Loop / Spawner
  const spawnNode = useCallback(() => {
    if (gameOver) return;

    setGrid(prev => {
      // Find idle nodes
      const idleIndices = prev
        .map((node, idx) => node.status === 'idle' ? idx : -1)
        .filter(idx => idx !== -1);

      if (idleIndices.length === 0) return prev;

      const randomIdx = idleIndices[Math.floor(Math.random() * idleIndices.length)];
      const newGrid = [...prev];
      newGrid[randomIdx] = { ...newGrid[randomIdx], status: 'active' };

      // Set timeout for this node to become corrupted
      const timerId = window.setTimeout(() => {
        handleNodeCorruption(randomIdx);
      }, Math.max(800, ACTIVE_TIMEOUT - (level * 100))) as number;

      activeTimersRef.current[randomIdx] = timerId;

      return newGrid;
    });

    // Schedule next spawn
    const spawnRate = Math.max(MIN_SPAWN_RATE, INITIAL_SPAWN_RATE - (level * 50));
    spawnTimerRef.current = window.setTimeout(spawnNode, spawnRate) as number;
  }, [gameOver, level]);

  const handleNodeCorruption = (index: number) => {
    setGrid(prev => {
      const newGrid = [...prev];
      // Only corrupt if still active (might have been clicked just in time)
      if (newGrid[index].status === 'active') {
        newGrid[index].status = 'corrupted';
        // Play glitch sound effect here if implemented
      }
      return newGrid;
    });

    setCorruption(prev => {
      const newCorruption = prev + 1;
      if (newCorruption >= MAX_CORRUPTION) {
        endGame();
      }
      return newCorruption;
    });
  };

  const handleNodeClick = (index: number) => {
    if (!gameStarted || gameOver) return;

    setGrid(prev => {
      const node = prev[index];

      if (node.status === 'active') {
        // Clear corruption timer
        if (activeTimersRef.current[index]) {
          clearTimeout(activeTimersRef.current[index]);
          delete activeTimersRef.current[index];
        }

        // Success!
        setScore(s => {
          const newScore = s + 10;
          setHighScore(h => Math.max(h, newScore));
          setLevel(Math.floor(newScore / 100) + 1);
          return newScore;
        });

        const newGrid = [...prev];
        newGrid[index].status = 'idle';
        return newGrid;
      }

      // Clicking corrupted or idle does nothing (or penalty?)
      return prev;
    });
  };

  const startGame = () => {
    setGrid(Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({ id: i, status: 'idle' })));
    setScore(0);
    setCorruption(0);
    setLevel(1);
    setGameOver(false);
    setGameStarted(true);

    // Clear any existing timers
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    Object.values(activeTimersRef.current).forEach((id: any) => clearTimeout(id));
    activeTimersRef.current = {};

    // Start spawning
    spawnTimerRef.current = window.setTimeout(spawnNode, 1000);
  };

  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    Object.values(activeTimersRef.current).forEach((id: any) => clearTimeout(id));
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
      Object.values(activeTimersRef.current).forEach((id: any) => clearTimeout(id));
    };
  }, []);

  // Continue spawning loop when state updates (via ref/effect or recursive timeout pattern)
  // The recursive timeout pattern inside spawnNode handles it, but we need to kick it off initially.
  // Ref-based dependency in callbacks ensures we access fresh state if needed, 
  // but here mostly functional updates are used.

  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case 'active': return 'bg-[#00ffff] shadow-[0_0_15px_#00ffff] scale-95'; // Cyan
      case 'corrupted': return 'bg-[#ff003c] shadow-[0_0_20px_#ff003c] animate-pulse'; // Red
      case 'idle': return 'bg-white/5 hover:bg-white/10';
      default: return 'bg-white/5';
    }
  };

  return (
    <div className="w-full bg-black py-16 px-4 flex flex-col items-center justify-center font-mono select-none">
      <div className="w-full max-w-2xl border border-white/10 p-6 relative bg-[#050505] shadow-[0_0_50px_rgba(0,0,0,0.5)]">

        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl md:text-3xl text-white font-light tracking-[0.2em] uppercase">
              Quantum <span className="text-[#00ffff]">Grid</span>
            </h2>
            <p className="text-[10px] text-white/40 tracking-widest mt-2">STABILIZE THE CORE</p>
          </div>
          <div className="text-right">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/40 tracking-widest uppercase mb-1">Integrity</span>
              <div className="flex space-x-1 mb-2">
                {[...Array(MAX_CORRUPTION)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-2 ${i < (MAX_CORRUPTION - corruption) ? 'bg-[#00ff41]' : 'bg-[#ff003c]'}`}
                  />
                ))}
              </div>
            </div>
            <div className="text-2xl text-white font-bold tracking-widest">
              {score.toString().padStart(4, '0')}
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="relative aspect-square w-full max-w-[400px] mx-auto">
          <div
            className="grid grid-cols-5 gap-2 w-full h-full"
            style={{ pointerEvents: (gameStarted && !gameOver) ? 'auto' : 'none' }}
          >
            {grid.map((node) => (
              <button
                key={node.id}
                onMouseDown={() => handleNodeClick(node.id)}
                onTouchStart={(e) => { e.preventDefault(); handleNodeClick(node.id); }}
                className={`w-full h-full rounded-sm transition-all duration-100 border border-white/5 ${getStatusColor(node.status)}`}
              />
            ))}
          </div>

          {/* Overlays */}
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10">
              <h3 className="text-3xl md:text-5xl text-white font-light tracking-[0.2em] mb-8 text-center">
                SYSTEM<br />READY
              </h3>
              <button
                onClick={startGame}
                className="px-8 py-3 border border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all duration-300 tracking-[0.3em] uppercase text-sm font-bold"
              >
                Initialize
              </button>
              <p className="mt-6 text-[10px] text-white/30 tracking-widest max-w-[200px] text-center leading-relaxed">
                TAP CYAN NODES BEFORE THEY CORRUPT. DO NOT LET INTEGRITY FAIL.
              </p>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/30 backdrop-blur-md z-10">
              <h3 className="text-4xl md:text-6xl text-[#ff003c] font-bold tracking-[0.1em] mb-2 text-shadow-neon">CRITICAL<br />FAILURE</h3>
              <div className="text-xl text-white tracking-widest mb-8">
                SCORE: {score}
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 border border-white/20 hover:border-white text-white transition-all duration-300 tracking-[0.3em] uppercase text-xs bg-black"
              >
                Reboot System
              </button>
            </div>
          )}
        </div>

        {/* Decorative Footer */}
        <div className="mt-8 flex justify-between items-center text-[9px] text-white/20 tracking-[0.2em] font-light border-t border-white/5 pt-4">
          <span>CPU: {level * 12}%</span>
          <span>MEM: OPTIMAL</span>
          <span>NET: SECURE</span>
        </div>
      </div>
    </div>
  );
};

export default QuantumGrid;
