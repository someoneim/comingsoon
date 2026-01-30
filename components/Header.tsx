
import React, { useState, useEffect } from 'react';
import { CONTACT_INFO, SOCIAL_LINKS } from '../constants';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <>
      {/* Top Header */}
      <header
        className={`w-full fixed top-0 z-50 flex flex-col items-center px-4 md:px-12 text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ease-in-out border-b ${isScrolled
          ? 'py-2 md:py-3 bg-black/90 backdrop-blur-xl border-white/10 shadow-2xl'
          : 'py-4 md:py-5 bg-transparent border-transparent'
          }`}
      >
        <div className="w-full max-w-7xl flex justify-between items-center">
          {/* Contact (Desktop) / Brand (Mobile) */}
          <div className="flex items-center">
            <a href={`mailto:${CONTACT_INFO.phone}`} className="hover:text-white transition-colors text-white/50 hidden md:inline-block lowercase">
              {CONTACT_INFO.phone}
            </a>
            {/* Mobile Brand Placeholder if needed, or keep clean */}
            <span className="md:hidden text-white/50 font-bold">AUTOMY</span>
          </div>

          {/* Social Icons (Desktop Only) */}
          <div className="hidden md:flex items-center space-x-6">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.url}
                className="hover:text-white transition-colors text-white/50"
                aria-label={link.label}
              >
                <div className={`w-9 h-9 backdrop-blur-md bg-white/5 border flex items-center justify-center transition-all duration-300 ease-out text-[11px] font-medium rounded-xl shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-110 hover:-translate-y-0.5 hover:bg-white/20 ${isScrolled ? 'border-white/20 hover:border-white' : 'border-white/10 hover:border-white'
                  }`}>
                  {link.label[0]}
                </div>
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Dock (iOS Style) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-fade-in-up">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url}
            className="group relative"
            aria-label={link.label}
          >
            <div className="w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-xs font-bold text-white rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2 group-hover:bg-white/20 group-hover:border-white/40 active:scale-95">
              {link.label[0]}
            </div>
          </a>
        ))}
      </div>
    </>
  );
};

export default Header;
