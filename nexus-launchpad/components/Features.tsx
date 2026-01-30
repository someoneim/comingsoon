
import React, { useState } from 'react';
import { FEATURES } from '../constants';
import { generateFeatureVisual } from '../services/visualService';
import { Feature } from '../types';

const Icon = ({ name, active }: { name: string; active: boolean }) => {
  const baseClass = `w-5 h-5 md:w-6 md:h-6 mb-4 transition-all duration-700 ease-out ${
    active ? 'text-white scale-110' : 'text-white/40 group-hover:text-white/90 group-hover:scale-110 group-hover:rotate-3'
  }`;
  
  switch (name) {
    case 'code':
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={baseClass}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case 'smartphone':
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={baseClass}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case 'shield':
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={baseClass}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    default:
      return null;
  }
};

const ShareIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const Features: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [visuals, setVisuals] = useState<Record<number, string>>({});
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const toggleExpand = async (index: number) => {
    const isExpanding = expandedIndex !== index;
    setExpandedIndex(isExpanding ? index : null);

    if (isExpanding && !visuals[index] && !loadingStates[index]) {
      setLoadingStates(prev => ({ ...prev, [index]: true }));
      const feature = FEATURES[index];
      const imageUrl = await generateFeatureVisual(feature.title, feature.details);
      
      if (imageUrl) {
        setVisuals(prev => ({ ...prev, [index]: imageUrl }));
      }
      setLoadingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleShare = async (e: React.MouseEvent, feature: Feature) => {
    e.stopPropagation();
    const shareData = {
      title: `Nexus - ${feature.title}`,
      text: `${feature.description} Check out Nexus Launchpad.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}: ${shareData.text} ${shareData.url}`);
        setShareFeedback("Link Copied!");
        setTimeout(() => setShareFeedback(null), 2000);
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full px-4 md:px-24 py-12 md:py-16 bg-black relative">
      {FEATURES.map((feature, idx) => {
        const isExpanded = expandedIndex === idx;
        const imageUrl = visuals[idx];
        const isLoading = loadingStates[idx];

        return (
          <div 
            key={feature.title} 
            onClick={() => toggleExpand(idx)}
            className={`group relative flex flex-col items-center text-center px-6 md:px-8 py-10 md:py-12 border-b md:border-b-0 md:border-r border-white/5 last:border-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer overflow-hidden ${
              isExpanded 
                ? 'bg-white/[0.04] shadow-[inset_0_0_50px_rgba(255,255,255,0.03)] border-white/10' 
                : 'hover:bg-white/[0.02] hover:border-white/10 hover:shadow-[0_0_40px_rgba(255,255,255,0.01)]'
            }`}
          >
            {/* Hover Glimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            
            {/* Animated Highlight Line */}
            <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />

            <div className={`flex flex-col items-center w-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              !isExpanded ? 'group-hover:-translate-y-2 group-hover:scale-[1.02]' : ''
            }`}>
              <Icon name={feature.icon} active={isExpanded} />
              
              <h3 className={`text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] font-semibold mb-4 md:mb-6 transition-all duration-500 ${
                isExpanded ? 'text-white scale-105' : 'text-white/50 group-hover:text-white/90'
              }`}>
                {feature.title}
              </h3>
              
              <p className={`text-[10px] md:text-[11px] leading-relaxed font-light tracking-widest max-w-[280px] transition-all duration-500 ${
                isExpanded ? 'text-white/70' : 'text-white/30 group-hover:text-white/60'
              }`}>
                {feature.description}
              </p>

              {/* Refined Expandable Details Area */}
              <div 
                className={`grid transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isExpanded ? 'grid-rows-[1fr] opacity-100 mt-6 md:mt-8' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden flex flex-col items-center">
                  <div className={`text-[9px] md:text-[10px] uppercase leading-relaxed tracking-[0.2em] md:tracking-[0.25em] text-white/40 border-t border-white/5 pt-6 md:pt-8 transition-transform duration-700 ease-out ${
                    isExpanded ? 'translate-y-0' : 'translate-y-4'
                  }`}>
                    {feature.details}
                  </div>

                  {/* Share Button Section */}
                  <div className={`mt-6 transition-all duration-1000 delay-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <button 
                      onClick={(e) => handleShare(e, feature)}
                      className="flex items-center space-x-2 text-[8px] tracking-[0.3em] uppercase text-white/40 hover:text-white transition-all border border-white/10 hover:border-white/30 px-4 py-2 rounded-full group/share"
                    >
                      <ShareIcon />
                      <span>{shareFeedback && expandedIndex === idx ? shareFeedback : 'Share details'}</span>
                    </button>
                  </div>

                  {/* AI Generated Media Container */}
                  <div className={`relative mt-6 md:mt-8 w-full aspect-video bg-white/[0.02] border border-white/5 rounded-sm overflow-hidden transition-all duration-1000 ${
                    isExpanded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                  }`}>
                    {isLoading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                        <div className="w-6 h-6 border-t border-white/40 rounded-full animate-spin" />
                        <span className="text-[7px] tracking-[0.3em] text-white/20 uppercase animate-pulse">Initializing...</span>
                      </div>
                    )}
                    
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={feature.title} 
                        className={`w-full h-full object-cover transition-opacity duration-1000 ease-in ${
                          isLoading ? 'opacity-0' : 'opacity-60 hover:opacity-100'
                        }`}
                        onLoad={() => setLoadingStates(prev => ({ ...prev, [idx]: false }))}
                      />
                    )}

                    {/* Scanner Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                    {isLoading && (
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-[scan_2s_linear_infinite]" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Expansion Indicator (Animated Plus/Minus) */}
              <div className="mt-8 md:mt-10 relative w-4 h-4 md:w-5 md:h-5 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                <div className={`absolute w-3 h-[1px] bg-white transition-all duration-500 ${isExpanded ? 'rotate-180 scale-125 bg-white' : 'rotate-0 group-hover:scale-125'}`} />
                <div className={`absolute h-3 w-[1px] bg-white transition-all duration-500 ease-in-out ${isExpanded ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100 group-hover:scale-125'}`} />
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(200px); }
        }
      `}</style>
    </div>
  );
};

export default Features;
