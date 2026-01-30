
import React, { useState } from 'react';
import { getPersonalizedWelcome } from '../services/geminiService';

const NotifyForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [aiMessage, setAiMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const message = await getPersonalizedWelcome(email);
      setAiMessage(message);
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 px-4">
      {status === 'success' ? (
        <div className="text-center animate-fade-in">
          <p className="text-white/80 font-light italic mb-2">"{aiMessage}"</p>
          <button 
            onClick={() => setStatus('idle')}
            className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            Back
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR EMAIL ADDRESS"
              className="w-full bg-transparent border-b border-white/20 py-3 text-center text-sm tracking-widest focus:outline-none focus:border-white transition-colors uppercase placeholder:text-white/20"
              required
              disabled={status === 'loading'}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="text-[10px] uppercase tracking-[0.5em] text-white/60 hover:text-white transition-all disabled:opacity-50"
          >
            {status === 'loading' ? 'PROCESSING...' : 'NOTIFY ME'}
          </button>
        </form>
      )}
    </div>
  );
};

export default NotifyForm;
