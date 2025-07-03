import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Ripple helper (if not already imported)
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  circle.classList.add('ripple');
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
  circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
  button.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());
}

// SVG Illustrations
const HeroIllustration = () => (
  <svg width="340" height="320" viewBox="0 0 340 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-md mx-auto drop-shadow-xl">
    <rect x="20" y="40" width="300" height="180" rx="40" fill="#76ABAE" opacity="0.18" />
    <rect x="60" y="80" width="220" height="120" rx="32" fill="#76ABAE" opacity="0.32" />
    <rect x="110" y="130" width="120" height="60" rx="20" fill="#76ABAE" />
    <circle cx="270" cy="60" r="22" fill="#76ABAE" opacity="0.5" />
    <circle cx="70" cy="220" r="14" fill="#31363F" opacity="0.5" />
    <circle cx="170" cy="300" r="10" fill="#76ABAE" opacity="0.3" />
  </svg>
);

const FeatureSVGs = [
  // 8 SVGs for each feature
  // 1. Widget
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" key="f1"><rect x="6" y="10" width="36" height="28" rx="8" fill="#76ABAE" opacity="0.12"/><rect x="12" y="16" width="24" height="16" rx="4" fill="#76ABAE"/><rect x="18" y="22" width="12" height="4" rx="2" fill="#EEEEEE"/></svg>,
  // 2. Auth
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" key="f2"><circle cx="24" cy="20" r="8" fill="#31363F" opacity="0.12"/><circle cx="24" cy="20" r="6" fill="#31363F"/><rect x="12" y="32" width="24" height="6" rx="3" fill="#31363F"/></svg>,
  // 3. Analytics
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" key="f3"><rect x="10" y="30" width="6" height="8" rx="3" fill="#76ABAE"/><rect x="21" y="22" width="6" height="16" rx="3" fill="#31363F"/><rect x="32" y="14" width="6" height="24" rx="3" fill="#76ABAE"/></svg>,
  // 4. Theme
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" key="f4"><circle cx="24" cy="24" r="20" fill="#76ABAE" opacity="0.12"/><circle cx="24" cy="24" r="12" fill="#31363F" opacity="0.18"/><rect x="16" y="16" width="16" height="16" rx="8" fill="#76ABAE"/></svg>,
  // 5. Live Preview
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" key="f5"><rect x="8" y="12" width="32" height="24" rx="8" fill="#31363F" opacity="0.12"/><rect x="14" y="18" width="20" height="12" rx="6" fill="#76ABAE"/><circle cx="24" cy="24" r="4" fill="#EEEEEE"/></svg>,
  // 6. Dark/Light
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" key="f6"><circle cx="24" cy="24" r="20" fill="#31363F" opacity="0.12"/><circle cx="24" cy="24" r="12" fill="#EEEEEE"/><path d="M24 12a12 12 0 0 0 0 24V12z" fill="#76ABAE"/></svg>,
  // 7. Inbox
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" key="f7"><rect x="8" y="16" width="32" height="20" rx="8" fill="#76ABAE" opacity="0.12"/><rect x="14" y="22" width="20" height="8" rx="4" fill="#31363F"/><rect x="18" y="30" width="12" height="4" rx="2" fill="#EEEEEE"/></svg>,
  // 8. Email
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" key="f8"><rect x="8" y="14" width="32" height="20" rx="8" fill="#31363F" opacity="0.12"/><rect x="12" y="18" width="24" height="12" rx="6" fill="#EEEEEE"/><path d="M12 18l12 8 12-8" stroke="#76ABAE" strokeWidth="2"/></svg>,
];

const features = [
  {
    title: 'Embeddable Form Widget',
    desc: 'Easily add a beautiful, customizable form to any website with a single line of code.',
  },
  {
    title: 'Owner Authentication',
    desc: 'Secure registration and login for website owners, with JWT-based route protection.',
  },
  {
    title: 'Real-time Analytics',
    desc: 'Track submissions and view animated charts with actionable insights.',
  },
  {
    title: 'Theme Customization',
    desc: 'Change colors, shapes, fonts, and more. Live preview your widget as you customize.',
  },
  {
    title: 'Live Preview & Micro-interactions',
    desc: 'Instantly see your changes with smooth transitions and interactive UI elements.',
  },
  {
    title: 'Dark & Light Mode',
    desc: 'Global theme system with seamless switching and beautiful styles for every mood.',
  },
  {
    title: 'Submission Inbox',
    desc: 'View, search, and manage all your form submissions in one place.',
  },
  {
    title: 'Email Notifications',
    desc: 'Get instant email alerts for every new submission.',
  },
];

const stats = [
  { label: 'Forms Created', value: '1000+' },
  { label: 'Uptime', value: '99.99%' },
  { label: 'User Rating', value: '5★' },
];

// For features section, add variants for staggered animation
const featureVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.13, duration: 0.7, ease: 'easeOut' },
  }),
};

// For the features grid, wrap with motion.div and set variants for staggerChildren
const featuresGridVariants = {
  visible: {
    transition: { staggerChildren: 0.13 }
  },
};

// Custom scroll reveal hook
function useScrollReveal(ref, options = { threshold: 0.1 }) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('revealed');
          observer.disconnect();
        }
      },
      options
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, options]);
}

// ScrollReveal component
function ScrollReveal({ children, className = '', ...props }) {
  const ref = useRef();
  useScrollReveal(ref);
  return (
    <div ref={ref} className={`scroll-reveal ${className}`} {...props}>
      {children}
    </div>
  );
}

// Remove scrollYProgress and Framer Motion scroll bar
// Add custom scroll progress bar
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(percent);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-[color:var(--accent2)] z-[9999]" style={{ transform: `scaleX(${progress})`, transformOrigin: 'left', transition: 'transform 0.2s cubic-bezier(.4,2,.6,1)' }} />
  );
}

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, []);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)] flex flex-col">
      {/* Hero Section */}
      <ScrollReveal className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl w-full mx-auto px-4 md:px-10 pt-12 md:pt-20 pb-8 md:pb-16 gap-10 md:gap-16">
        {/* Left */}
        <div className="flex-1 flex flex-col items-start justify-center gap-6 md:gap-8">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-2">
            Build <span className="text-[color:var(--accent)]">Modern Forms</span><br />
            For Your Website
          </h1>
          <p className="text-lg md:text-2xl text-[color:var(--text-secondary)] max-w-xl mb-2">
            Embed beautiful, customizable forms, track analytics, and manage submissions—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="btn text-lg px-8 py-3 font-bold w-full sm:w-auto" onClick={e => { navigate('/register'); createRipple(e); }} aria-label="Get Started Free">Get Started Free</button>
            <button className="btn text-lg px-8 py-3 font-bold w-full sm:w-auto" style={{ background: 'var(--card-bg)', color: 'var(--accent)', border: '2px solid var(--accent)' }} onClick={e => { navigate('/widget'); createRipple(e); }} aria-label="Live Demo">Live Demo</button>
          </div>
        </div>
        {/* Right */}
        <div className="flex-1 flex items-center justify-center mb-8 md:mb-0">
          <ScrollReveal>
            <HeroIllustration />
          </ScrollReveal>
        </div>
      </ScrollReveal>
      {/* Stats Row */}
      <ScrollReveal className="flex flex-row flex-wrap justify-center gap-6 max-w-4xl w-full mx-auto mb-12">
        {stats.map((stat) => (
          <ScrollReveal key={stat.label} className="flex-1 min-w-[160px] max-w-[220px] bg-[color:var(--card-bg)] border-t-4 border-[color:var(--accent)] rounded-2xl shadow p-6 flex flex-col items-center text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-[color:var(--accent)] mb-1">{stat.value}</div>
            <div className="text-[color:var(--text-secondary)] text-base md:text-lg font-medium">{stat.label}</div>
          </ScrollReveal>
        ))}
      </ScrollReveal>
      {/* Features Section */}
      <ScrollReveal className="max-w-7xl w-full mx-auto px-4 md:px-10 py-8 md:py-14">
        <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-10 text-[color:var(--accent)]">Why FormService?</h2>
        <ScrollReveal variants={featuresGridVariants} initial="hidden" whileInView="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
          {features.map((f, i) => (
            <ScrollReveal
              key={f.title}
              className="bg-[color:var(--card-bg)] border-t-4 border-[color:var(--accent)] rounded-2xl shadow p-6 flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-2 hover:shadow-lg"
              custom={i}
              variants={featureVariants}
            >
              <div className="mb-4">{FeatureSVGs[i]}</div>
              <div className="font-bold text-lg md:text-xl mb-2 text-[color:var(--accent)]">{f.title}</div>
              <div className="text-[color:var(--text-secondary)] text-base md:text-lg">{f.desc}</div>
            </ScrollReveal>
          ))}
        </ScrollReveal>
      </ScrollReveal>
      {/* Call to Action */}
      <ScrollReveal className="max-w-2xl mx-auto w-full px-4 md:px-8 py-10 md:py-16 text-center">
        <h2 className="text-2xl md:text-4xl font-extrabold mb-4">Ready to get started?</h2>
        <p className="text-[color:var(--text-secondary)] text-base md:text-lg mb-8">Create your free account and start collecting leads in minutes.</p>
        <button className="btn text-lg px-10 py-3 font-bold w-full sm:w-auto" onClick={e => { navigate('/register'); createRipple(e); }} aria-label="Sign Up Free">Sign Up Free</button>
      </ScrollReveal>
      {/* BackToTopButton */}
      <BackToTopButton />
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />
    </div>
  );
};

// BackToTopButton component
function BackToTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <ScrollReveal
      initial={{ opacity: 0, y: 40 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 bg-[color:var(--accent)] text-white rounded-full shadow-lg p-3 md:p-4 flex items-center justify-center hover:scale-110 transition-transform"
      style={{ pointerEvents: show ? 'auto' : 'none' }}
      aria-label="Back to top"
    >
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
    </ScrollReveal>
  );
}

export default LandingPage;