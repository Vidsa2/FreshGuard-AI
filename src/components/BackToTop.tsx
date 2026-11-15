import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      title="Scroll back to top"
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] text-emerald-300 shadow-xl border border-emerald-400/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 animate-in fade-in slide-in-from-bottom-4 group cursor-pointer"
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};

