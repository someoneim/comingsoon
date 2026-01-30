import React, { useState, useEffect, useRef } from 'react';

const SECRET_CODE = 'auto'; // Trigger code
const WELCOME_MSG = [
    "PROTOCOL INITIATED...",
    "ACCESS GRANTED.",
    "WELCOME TO THE NEXUS.",
    "TYPE 'help' FOR AVAILABLE COMMANDS."
];

const SecretTerminal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [keyBuffer, setKeyBuffer] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Keyboard Listener for Secret Code
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isOpen) return;

            const char = e.key.toLowerCase();
            // Only allow letters
            if (!/^[a-z]$/.test(char)) return;

            setKeyBuffer(prev => {
                const newBuffer = (prev + char).slice(-SECRET_CODE.length);
                if (newBuffer === SECRET_CODE) {
                    setIsOpen(true);
                    setHistory(WELCOME_MSG);
                    return '';
                }
                return newBuffer;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Focus Input when Open
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, history]);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd: string) => {
        const cleanCmd = cmd.trim().toLowerCase();
        let response: string[] = [];

        switch (cleanCmd) {
            case 'help':
                response = [
                    "AVAILABLE COMMANDS:",
                    "- help: SHOW THIS MESSAGE",
                    "- about: PROJECT INFO",
                    "- system: SYSTEM STATUS",
                    "- clear: CLEAR TERMINAL",
                    "- exit: CLOSE CONNECTION"
                ];
                break;
            case 'about':
                response = [
                    "AUTONY IS THE FUTURE OF AUTOMATION.",
                    "WE ARE BUILDING INTELLIGENT AGENTS.",
                    "STAY TUNED."
                ];
                break;
            case 'system':
                response = [
                    "CPU: OPTIMAL",
                    "MEMORY: 32TB",
                    "NETWORK: SECURE",
                    "LOCATION: [CLASSIFIED]"
                ];
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'exit':
                setIsOpen(false);
                setKeyBuffer('');
                return;
            default:
                response = [`COMMAND NOT FOUND: ${cleanCmd}`];
        }

        setHistory(prev => [...prev, `> ${cmd}`, ...response]);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        handleCommand(input);
        setInput('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black text-green-500 font-mono p-4 md:p-10 overflow-hidden flex flex-col" onClick={() => inputRef.current?.focus()}>
            {/* CRT Effects */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,255,0,0.02)_50%)] z-10 bg-[length:100%_4px]"></div>
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] z-10"></div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto scrollbar-hide space-y-2 pb-4">
                {history.map((line, i) => (
                    <div key={i} className="break-words leading-relaxed animate-fade-in">
                        {line}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={onSubmit} className="flex items-center mt-2 border-t border-green-900/50 pt-2">
                <span className="mr-2">{'>'}</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow bg-transparent border-none outline-none text-green-500 font-mono uppercase caret-green-500"
                    autoFocus
                    spellCheck={false}
                />
            </form>
        </div>
    );
};

export default SecretTerminal;
