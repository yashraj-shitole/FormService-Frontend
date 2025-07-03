import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../App';

// SVGs for sun and moon
const SunSVG = () => (
  <svg width="20" height="20" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="7" fill="#FFD600"/><g stroke="#FFD600" strokeWidth="2"><line x1="14" y1="2" x2="14" y2="6"/><line x1="14" y1="22" x2="14" y2="26"/><line x1="2" y1="14" x2="6" y2="14"/><line x1="22" y1="14" x2="26" y2="14"/><line x1="5.1" y1="5.1" x2="7.8" y2="7.8"/><line x1="20.2" y1="20.2" x2="22.9" y2="22.9"/><line x1="5.1" y1="22.9" x2="7.8" y2="20.2"/><line x1="20.2" y1="7.8" x2="22.9" y2="5.1"/></g></svg>
);
const MoonSVG = () => (
  <svg width="20" height="20" viewBox="0 0 28 28" fill="none"><path d="M22 19.5C20.5 20.5 18.8 21 17 21C12 21 8 17 8 12C8 10.2 8.5 8.5 9.5 7C6.5 8.5 4.5 11.6 4.5 15C4.5 20 8.5 24 13.5 24C16.9 24 20 22 21.5 19C21.2 19.2 21.6 19.3 22 19.5Z" fill="#FFD600"/></svg>
);

function getWaveColor(targetTheme) {
  return targetTheme === 'dark' ? '#222831' : '#fff';
}

const ThemeToggleSwitch = ({ className = '', onThemeChangeEnd }) => {
  const { theme, toggleTheme } = useTheme();
  const [dissolve, setDissolve] = useState(false); // true when overlay is active
  const switchRef = useRef();

  const handleToggle = () => {
    setDissolve(true);
    // Theme changes at peak opacity (50% of duration)
    setTimeout(() => {
      toggleTheme();
    }, 700); // 0.7s (half of 1.4s)
    setTimeout(() => {
      setDissolve(false);
      if (onThemeChangeEnd) onThemeChangeEnd();
    }, 1400); // 1.4s total
  };

  return (
    <>
      <button
        ref={switchRef}
        className={`relative w-14 h-8 flex items-center transition-colors duration-300 focus:outline-none ${className}`}
        style={{ background: theme === 'dark' ? '#31363F' : '#FFF', borderRadius: '999px', boxShadow: '0 2px 8px rgba(34,40,49,0.08)' }}
        onClick={handleToggle}
        aria-label="Toggle dark mode"
        disabled={dissolve}
      >
        <span
          className={`absolute left-1 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow transition-transform duration-500 ${theme === 'dark' ? 'translate-x-6' : ''}`}
          style={{
            transition: 'transform 0.5s cubic-bezier(.4,2,.6,1)',
            padding: '4px',
            background: theme === 'dark' ? '#FFF' : '#31363F',
            // White for moon, dark for sun
          }}
        >
          <span className="block transition-transform duration-500" style={{ transform: theme === 'dark' ? 'rotate(-40deg) scale(1.1)' : 'rotate(0deg) scale(1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme === 'dark' ? <MoonSVG /> : <SunSVG />}
          </span>
        </span>
        <span className="absolute left-0 top-0 w-full h-full pointer-events-none" />
      </button>
      {dissolve && createPortal(<DissolveOverlay />, document.body)}
    </>
  );
};

const DissolveOverlay = () => (
  <div
    style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 1,
      background: '#111',
      animation: 'theme-dissolve-black 1.4s cubic-bezier(0.4,0,0.2,1) forwards',
    }}
  />
);

export default ThemeToggleSwitch; 