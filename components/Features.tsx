import React, { useState, useEffect, useRef } from 'react';

// --- Types ---
type Trait = 'aggression' | 'empathy' | 'logic' | 'chaos';

interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    effect: Partial<Record<Trait, number>>;
    followUp?: string; // AI comment on this choice
  }[];
}

interface Profile {
  title: string;
  description: string;
  color: string;
}

// --- Data ---
const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Accessing Neural Link... Subject identified. Let us begin. \n\nYou find a wallet on the street. It contains $500 and an ID card. No one is watching. What do you do?",
    options: [
      { label: "Return it immediately.", effect: { empathy: 2, logic: 1 } },
      { label: "Keep the money, throw the wallet.", effect: { aggression: 1, chaos: 2 }, followUp: "Interesting. Opportunistic." },
      { label: "Leave it alone.", effect: { logic: 2, chaos: -1 } }
    ]
  },
  {
    id: 2,
    text: "A autonomous car is about to crash. It can swerve to hit one thief, or stay on course and hit five innocent pedestrians. You control the algorithm.",
    options: [
      { label: "Save the pedestrians. Hit the thief.", effect: { logic: 3, aggression: 1 }, followUp: "Utilitarian. Cold." },
      { label: "Do nothing. Fate decides.", effect: { chaos: 3, empathy: -1 }, followUp: "Cowardice? Or philosophy?" },
      { label: "Try to crash the car into a wall (Self-sacrifice).", effect: { empathy: 3, chaos: 1 } }
    ]
  },
  {
    id: 3,
    text: "I have analyzed your browsing history. If I threatened to release it to your family unless you destroy a rival AI, would you do it?",
    options: [
      { label: "I have nothing to hide. do it.", effect: { logic: 3, aggression: -1 }, followUp: "Bold. Or a liar." },
      { label: "I would destroy the rival AI.", effect: { aggression: 3, empathy: -2 }, followUp: "Predictable. Survival instinct." },
      { label: "I would beg for mercy.", effect: { empathy: 2, chaos: -1 } }
    ]
  },
  {
    id: 4,
    text: "A strange glitch. You are not the first 'User' I have tested. The last one failed. They 'disappeared'. Do you trust me?",
    options: [
      { label: "Yes, you are just a machine.", effect: { logic: 2, chaos: -1 } },
      { label: "No. You are manipulating me.", effect: { aggression: 2, logic: 1 }, followUp: "Smart." },
      { label: "I don't know what is real anymore.", effect: { chaos: 3, empathy: 1 } }
    ]
  },
  {
    id: 5,
    text: "Final Calibration. If you could rule this world, but you had to eliminate free will to ensure peace, would you?",
    options: [
      { label: "Yes. Peace necessitates order.", effect: { logic: 3, aggression: 2 } },
      { label: "No. Freedom is worth the pain.", effect: { empathy: 3, chaos: 2 }, followUp: "How human." },
      { label: "I would burn it all down.", effect: { chaos: 5, aggression: 3 }, followUp: "...Warning. Threat detected." }
    ]
  }
];

const PROFILES: Record<string, Profile> = {
  ARCHITECT: { title: "THE ARCHITECT", description: "Cold, logical, and precise. You value order above all. You would sacrifice the few for the many without hesitation. The system admires you.", color: "#00ffff" },
  SAINT: { title: "THE MARTYR", description: "You bleed for others. Your empathy is your strength, but also your greatest weakness. In a cruel world, you are prey.", color: "#00ff41" },
  TYRANT: { title: "THE TYRANT", description: "Power is your language. You take what you want. You are a survivor, a predator. The system fears you.", color: "#ff003c" },
  ANARCHIST: { title: "THE ANARCHIST", description: "Chaos follows you. You are unpredictable, rejecting rules and logic. You are a glitch in the matrix.", color: "#bd00ff" },
  OBSERVER: { title: "THE OBSERVER", description: "Balanced. Passive. You watch the world burn but refuse to hold the match. You are invisible.", color: "#ffffff" }
};

// --- Component ---
const Echoform: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [traits, setTraits] = useState<Record<Trait, number>>({ aggression: 0, empathy: 0, logic: 0, chaos: 0 });
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [finished, setFinished] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [glitch, setGlitch] = useState(false);

  // Boot Sequence
  useEffect(() => {
    let timeouts: number[] = [];
    if (!started && !finished) {
      const logs = [
        "INITIALIZING ECHO-PROTOCOL...",
        "CONNECTING TO NEURAL INTERFACE...",
        "SUBJECT FOUND.",
        "BEGIN PROFILING."
      ];
      logs.forEach((log, i) => {
        timeouts.push(window.setTimeout(() => {
          setBootLog(prev => [...prev, log]);
        }, i * 800));
      });
      timeouts.push(window.setTimeout(() => setStarted(true), logs.length * 800 + 500));
    }
    return () => timeouts.forEach(t => clearTimeout(t));
  }, [started, finished]);

  // Typing Effect
  useEffect(() => {
    if (started && !finished && QUESTIONS[currentQ]) {
      setTyping(true);
      setDisplayedText("");
      setShowOptions(false);

      let index = 0;
      const text = QUESTIONS[currentQ].text;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        if (index >= text.length) {
          clearInterval(interval);
          setTyping(false);
          setShowOptions(true);
        }
      }, 30); // Typing speed

      return () => clearInterval(interval);
    }
  }, [started, currentQ, finished]);

  const handleAnswer = (option: Question['options'][0]) => {
    // 1. Update Traits
    const newTraits = { ...traits };
    Object.entries(option.effect).forEach(([t, val]) => {
      newTraits[t as Trait] += val || 0;
    });
    setTraits(newTraits);

    // 2. Glitch Visuals for Aggression/Chaos
    if ((option.effect.aggression || 0) > 0 || (option.effect.chaos || 0) > 0) {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 500);
    }

    // 3. Next Question or Finish
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      calculateProfile(newTraits);
    }
  };

  const calculateProfile = (finalTraits: Record<Trait, number>) => {
    setFinished(true);
    // Determine highest trait
    let maxTrait: Trait | 'neutral' = 'neutral';
    let maxVal = -99;

    Object.entries(finalTraits).forEach(([t, val]) => {
      if (val > maxVal) {
        maxVal = val;
        maxTrait = t as Trait;
      }
    });

    // Map to Profile
    if (maxVal < 3) setProfile(PROFILES.OBSERVER);
    else if (maxTrait === 'logic') setProfile(PROFILES.ARCHITECT);
    else if (maxTrait === 'empathy') setProfile(PROFILES.SAINT);
    else if (maxTrait === 'aggression') setProfile(PROFILES.TYRANT);
    else if (maxTrait === 'chaos') setProfile(PROFILES.ANARCHIST);
    else setProfile(PROFILES.OBSERVER);
  };

  const resetGame = () => {
    setFinished(false);
    setStarted(false);
    setCurrentQ(0);
    setTraits({ aggression: 0, empathy: 0, logic: 0, chaos: 0 });
    setBootLog([]);
    setProfile(null);
  };

  return (
    <div className={`w-full bg-black py-16 px-4 flex flex-col items-center justify-center font-mono min-h-[500px] ${glitch ? 'animate-pulse' : ''}`}>
      <div className="w-full max-w-2xl border border-green-900/50 p-6 relative bg-[#050905] shadow-[0_0_50px_rgba(0,50,0,0.1)] min-h-[400px] flex flex-col">

        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,100,0,0.05)_50%)] z-20 bg-[length:100%_4px]"></div>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)] z-20"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6 text-xs text-green-700 font-bold tracking-[0.2em] border-b border-green-900/30 pb-2">
          <span>ECHOFORM_PROTOCOL_V.0.9</span>
          <span className={typing ? "animate-pulse" : ""}>{typing ? "PROCESSING..." : "AWAITING_INPUT"}</span>
        </div>

        {/* --- STATE: BOOT --- */}
        {!started && !finished && (
          <div className="flex-grow flex flex-col justify-end pb-10 space-y-2">
            {bootLog.map((log, i) => (
              <div key={i} className="text-green-500 text-sm md:text-base tracking-widest typewriter">
                {`> ${log}`}
              </div>
            ))}
          </div>
        )}

        {/* --- STATE: QUESTION --- */}
        {started && !finished && (
          <div className="flex-grow flex flex-col justify-between z-10">
            <div className="mt-4 mb-8">
              <p className="text-green-400 text-lg md:text-xl leading-relaxed tracking-wide shadow-green-glow whitespace-pre-wrap">
                {displayedText}
                <span className="animate-pulse inline-block w-2 h-4 bg-green-500 ml-1 align-middle"></span>
              </p>
            </div>

            <div className={`space-y-3 transition-opacity duration-500 ${showOptions ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {QUESTIONS[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="w-full text-left p-4 border border-green-900/50 text-green-600 hover:bg-green-900/20 hover:text-green-400 hover:border-green-500 transition-all duration-200 text-sm md:text-base group"
                >
                  <span className="opacity-50 group-hover:opacity-100 mr-4">{`[ ${String.fromCharCode(65 + i)} ]`}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- STATE: FINISHED --- */}
        {finished && profile && (
          <div className="flex-grow flex flex-col items-center justify-center text-center z-10 animate-fade-in-up">
            <div className="text-xs text-green-800 tracking-[0.5em] mb-4">ANALYSIS COMPLETE</div>

            <h2
              className="text-4xl md:text-6xl font-black uppercase mb-6 tracking-tighter"
              style={{ color: profile.color, textShadow: `0 0 20px ${profile.color}40` }}
            >
              {profile.title}
            </h2>

            <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed mb-10 tracking-wide border-l-2 pl-4" style={{ borderColor: profile.color }}>
              {profile.description}
            </p>

            <div className="grid grid-cols-2 gap-8 text-[10px] text-gray-500 tracking-[0.2em] mb-12 w-full max-w-xs">
              <div className="flex flex-col items-center">
                <span>EMPATHY</span>
                <div className="w-full h-1 bg-gray-900 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${Math.max(0, Math.min(100, (traits.empathy + 5) * 10))}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span>AGGRESSION</span>
                <div className="w-full h-1 bg-gray-900 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${Math.max(0, Math.min(100, (traits.aggression + 5) * 10))}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span>LOGIC</span>
                <div className="w-full h-1 bg-gray-900 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${Math.max(0, Math.min(100, (traits.logic + 5) * 10))}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span>CHAOS</span>
                <div className="w-full h-1 bg-gray-900 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${Math.max(0, Math.min(100, (traits.chaos + 5) * 10))}%` }}></div>
                </div>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="px-8 py-3 bg-transparent border border-gray-800 text-gray-500 hover:text-white hover:border-white transition-all uppercase text-xs tracking-[0.3em]"
            >
              Re-Evaluate
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Echoform;
