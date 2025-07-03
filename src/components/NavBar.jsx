import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../App';
import ThemeToggleSwitch from './ThemeToggleSwitch';

// Ripple helper
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  circle.classList.add('ripple');
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
  circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
  circle.style.position = 'absolute';
  circle.style.pointerEvents = 'none';
  circle.style.zIndex = 2;
  button.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());
}

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const { theme, toggleTheme } = useTheme();

  const navLinkBase =
    'px-3 py-2 text-base font-medium text-[color:var(--accent)] dark:text-[color:var(--accent)] rounded transition-none border-none bg-transparent outline-none focus:bg-[color:var(--accent)]/10';
  const navLinkActive =
    'font-bold border-b-2 border-[color:var(--accent2)] text-[color:var(--accent2)] dark:text-[color:var(--accent2)]';

  // Close menu on navigation (mobile)
  const handleNavClick = (to) => {
    setMenuOpen(false);
    navigate(to);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#18181b] shadow-md rounded-b-xl md:rounded-b-2xl px-4 md:px-8 py-2 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full text-white">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick(token ? '/dashboard' : '/login')}>
          <img src="/logo192.png" alt="ReachOut" className="w-8 h-8 md:w-9 md:h-9 rounded" />
          <span className="font-bold text-lg md:text-2xl text-[color:var(--accent)] dark:text-[color:var(--accent)]">ReachOut</span>
        </div>
        {/* Desktop: Links */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-2">
          <NavLink to="/" className={({ isActive }) => `animated-underline ${navLinkBase} ${isActive ? navLinkActive + ' active' : ''}`}>Home</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `animated-underline ${navLinkBase} ${isActive ? navLinkActive + ' active' : ''}`}>Dashboard</NavLink>
          <NavLink to="/widget" className={({ isActive }) => `animated-underline ${navLinkBase} ${isActive ? navLinkActive + ' active' : ''}`}>Widget</NavLink>
          {!token && <NavLink to="/login" className={({ isActive }) => `animated-underline ${navLinkBase} ${isActive ? navLinkActive + ' active' : ''}`}>Login</NavLink>}
          {!token && <NavLink to="/register" className={({ isActive }) => `animated-underline ${navLinkBase} ${isActive ? navLinkActive + ' active' : ''}`}>Register</NavLink>}
        </div>
        {/* Desktop: Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggleSwitch />
          {token && (
            <>
              <span className="text-sm md:text-base text-[color:var(--text-secondary)] dark:text-zinc-300 font-medium">{email}</span>
              <button className="btn px-4 py-2 text-base font-semibold rounded bg-[color:var(--accent)] text-white shadow" onClick={() => {
                sessionStorage.clear();
                handleNavClick('/login');
              }}>Logout</button>
            </>
          )}
        </div>
        {/* Mobile: Hamburger */}
        <button
          className={`md:hidden flex items-center px-2 py-1 text-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] rounded transition duration-200 ${menuOpen ? 'bg-[color:var(--accent)]/10 hamburger-bounce' : ''}`}
          onClick={e => { setMenuOpen(open => !open); createRipple(e); }}
          aria-label="Toggle navigation menu"
          style={{ zIndex: 60, boxShadow: menuOpen ? '0 2px 8px rgba(0,0,0,0.10)' : undefined, overflow: 'hidden', height: '44px' }}
        >
          <span className="relative w-7 h-7 block">
            <span
              className={`absolute left-0 w-7 h-1 rounded transition-all duration-300 shadow-sm
                ${menuOpen ? 'rotate-45 top-3.5' : 'top-2'}
                bg-[color:var(--accent)]
              `}
            ></span>
            <span
              className={`absolute left-0 w-7 h-1 rounded transition-all duration-300 shadow-sm
                ${menuOpen ? 'opacity-0 top-3.5' : 'top-4'}
                bg-[color:var(--accent)]
              `}
            ></span>
            <span
              className={`absolute left-0 w-7 h-1 rounded transition-all duration-300 shadow-sm
                ${menuOpen ? '-rotate-45 top-3.5' : 'top-6'}
                bg-[color:var(--accent)]
              `}
            ></span>
          </span>
        </button>
      </div>
      {/* Mobile: Slide-down menu with animation */}
      <div className={`md:hidden w-full bg-white dark:bg-zinc-900 shadow transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-[500px] opacity-100 translate-y-0 py-2' : 'max-h-0 opacity-0 -translate-y-4 py-0'} flex flex-col gap-2 px-2`}
        style={{ transitionProperty: 'max-height, opacity, transform, padding' }}>
        <NavLink to="/" onClick={() => handleNavClick('/')} className={({ isActive }) => `animated-underline ${navLinkBase} ${isActive ? navLinkActive + ' active' : ''}`}>Home</NavLink>
        <NavLink to="/dashboard" onClick={() => handleNavClick('/dashboard')} className={({ isActive }) => `animated-underline ${navLinkBase} ${isActive ? navLinkActive + ' active' : ''}`}>Dashboard</NavLink>
        <NavLink to="/widget" onClick={() => handleNavClick('/widget')} className={({ isActive }) => `animated-underline ${navLinkBase} ${isActive ? navLinkActive + ' active' : ''}`}>Widget</NavLink>
        {!token && <NavLink to="/login" onClick={() => handleNavClick('/login')} className={({ isActive }) => `animated-underline ${navLinkBase} ${isActive ? navLinkActive + ' active' : ''}`}>Login</NavLink>}
        {!token && <NavLink to="/register" onClick={() => handleNavClick('/register')} className={({ isActive }) => `animated-underline ${navLinkBase} ${isActive ? navLinkActive + ' active' : ''}`}>Register</NavLink>}
        <ThemeToggleSwitch className="mt-2" onThemeChangeEnd={() => setMenuOpen(false)} />
        {token && (
          <>
            <span className="text-sm text-[color:var(--text-secondary)] dark:text-zinc-300 font-medium">{email}</span>
            <button className="btn px-4 py-2 text-base font-semibold rounded bg-[color:var(--accent)] text-white shadow" onClick={() => {
              sessionStorage.clear();
              handleNavClick('/login');
            }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar; 