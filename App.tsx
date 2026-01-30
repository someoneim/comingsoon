
import React from 'react';
import Header from './components/Header';
import Countdown from './components/Countdown';
import Features from './components/Features';
import NotifyForm from './components/NotifyForm';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
      <Header />

      {/* Hero Section */}
      <main id="home" className="relative flex-grow flex flex-col items-center justify-center pt-32 pb-16 md:pt-24 md:pb-12 overflow-hidden px-4">
        {/* Atmospheric Background with Shadow Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=2000"
            alt="Atmospheric Background"
            className="w-full h-full object-cover opacity-30 grayscale brightness-50"
          />
          {/* Shaft of light effect simulation */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,black_80%)]" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl">
          {/* Logo */}
          <img
            src="/automy.png"
            alt="Automy Logo"
            className="w-16 h-16 md:w-24 md:h-24 object-contain mb-6 md:mb-8 transition-all duration-700 ease-spring-bouncy hover:scale-105 animate-scale-in cursor-pointer invert brightness-0"
          />

          <h1 className="text-xl sm:text-2xl md:text-5xl font-light tracking-tight md:tracking-tight uppercase mb-4 md:mb-6 text-white/90 px-2 leading-tight animate-fade-in-up [animation-delay:300ms]">
            We Are Almost Ready for Launch
          </h1>

          <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/40 max-w-xl leading-relaxed px-4 animate-fade-in-up [animation-delay:600ms]">
            Perfect and awesome template to present your future product or service.<br className="hidden sm:block" />
            Hooking audience attention is all in the opener.
          </p>

          <div className="animate-fade-in-up [animation-delay:900ms] w-full flex justify-center">
            <Countdown />
          </div>

          <div className="animate-fade-in-up [animation-delay:1100ms] w-full">
            <NotifyForm />
          </div>
        </div>
      </main>

      {/* Features Section */}
      <footer id="features" className="relative z-20 border-t border-white/5 bg-black">
        <Features />
      </footer>
    </div>
  );
};

export default App;
