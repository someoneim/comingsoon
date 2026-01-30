
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
    <header
      className={`w-full fixed top-0 z-50 flex flex-col items-center px-4 md:px-12 text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ease-in-out border-b ${isScrolled
        ? 'py-2 md:py-3 bg-black/90 backdrop-blur-xl border-white/10 shadow-2xl'
        : 'py-4 md:py-5 bg-transparent border-transparent'
        }`}
    >
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-8">
          <a href={`mailto:${CONTACT_INFO.phone}`} className="hover:text-white transition-colors text-white/50 hidden sm:inline-block lowercase">
            {CONTACT_INFO.phone}
          </a>


        </div>

        <div className="flex items-center space-x-5 md:space-x-6">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              className="hover:text-white transition-colors text-white/50"
              aria-label={link.label}
            >
              <div className={`w-5 h-5 border rounded-full flex items-center justify-center transition-all text-[7px] md:text-[8px] ${isScrolled ? 'border-white/30 hover:border-white' : 'border-white/20 hover:border-white'
                }`}>
                {link.label[0]}
              </div>
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
