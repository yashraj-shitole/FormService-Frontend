import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalytics, getSubmissions } from '../api/formService';
import AnalyticsCard from '../components/AnalyticsCard';
import SubmissionList from '../components/SubmissionList';
import ThemeCustomizer from '../components/ThemeCustomizer';

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
  button.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());
}

// Add custom ScrollReveal
function useScrollReveal(ref, options = { threshold: 0.1 }) {
  React.useEffect(() => {
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

function ScrollReveal({ children, className = '', ...props }) {
  const ref = useRef();
  useScrollReveal(ref);
  return (
    <div ref={ref} className={`scroll-reveal ${className}`} {...props}>
      {children}
    </div>
  );
}

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({ count: 0, latestSubmission: null });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownerEmail, setOwnerEmail] = useState('');
  const [siteKey, setSiteKey] = useState('');
  const navigate = useNavigate();
  const width = typeof window !== 'undefined' ? window.innerWidth : 1200;

  useEffect(() => {
    const storedSiteKey = sessionStorage.getItem('siteKey');
    setSiteKey(storedSiteKey || '');
    // Optionally decode JWT to get email
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setOwnerEmail(payload.email || '');
      } catch {}
    }
    async function fetchData() {
      setLoading(true);
      const [analyticsData, submissionsData] = await Promise.all([
        getAnalytics(storedSiteKey),
        getSubmissions(storedSiteKey),
      ]);
      setAnalytics(analyticsData);
      setSubmissions(submissionsData.submissions || []);
      setLoading(false);
    }
    if (storedSiteKey) fetchData();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className=" mx-auto mt-4 md:mt-10 px-2 md:px-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2 md:gap-0 w-full">
        <div>
          <div className="font-semibold text-[color:var(--accent)] text-sm md:text-base">Logged in as: <span className="text-[color:var(--text)]">{ownerEmail}</span></div>
          <div className="text-xs md:text-sm text-[color:var(--text-secondary)]">Site Key: <span className="font-mono">{siteKey}</span></div>
        </div>
        <button onClick={e => { handleLogout(); createRipple(e); }} className="btn bg-[color:var(--accent)] text-white shadow font-semibold text-sm md:text-base px-4 py-2 rounded w-full md:w-auto">Logout</button>
      </div>
      <h1 className="text-[color:var(--accent)] font-bold mb-8 text-2xl md:text-4xl tracking-wide w-full">Owner Dashboard</h1>
      <ThemeCustomizer siteKey={siteKey} />
      <ScrollReveal>
        <AnalyticsCard count={analytics.count} latest={analytics.latestSubmission} loading={loading} chartData={analytics.chartData} />
      </ScrollReveal>
      <SubmissionList submissions={submissions} loading={loading} />
    </div>
  );
};

export default Dashboard; 