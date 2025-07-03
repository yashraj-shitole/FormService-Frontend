import React, { useRef } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const mockData = [
  { month: 'Jan', submissions: 2 },
  { month: 'Feb', submissions: 5 },
  { month: 'Mar', submissions: 8 },
  { month: 'Apr', submissions: 4 },
  { month: 'May', submissions: 10 },
  { month: 'Jun', submissions: 7 },
];

// Uses Tailwind CSS for modern UI consistency
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

const AnalyticsCard = ({ count, latest, loading, chartData }) => (
  <ScrollReveal>
    <div className="card flex flex-col md:flex-row gap-6 md:gap-8 items-stretch md:items-center w-full p-3 md:p-6 mb-8">
      <div className="min-w-0 flex-1">
        <div className="text-[color:var(--accent)] font-semibold text-base md:text-lg">Total Submissions</div>
        <div className="text-[color:var(--text)] font-bold text-2xl md:text-4xl mt-1">{loading ? '...' : count}</div>
        <div className="text-[color:var(--accent)] font-semibold text-base md:text-lg mt-4">Latest Submission</div>
        <div className="text-[color:var(--text)] text-base md:text-lg mt-1">{loading ? '...' : (latest ? new Date(latest).toLocaleString() : '—')}</div>
      </div>
      <div className="flex md:flex md:flex-col w-full h-32 md:h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData || mockData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={13} />
            <YAxis stroke="var(--text-secondary)" fontSize={13} allowDecimals={false} />
            <Tooltip contentStyle={{ background: 'var(--card-bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8 }} />
            <Line type="monotone" dataKey="submissions" stroke="var(--accent)" strokeWidth={3} dot={{ r: 5, fill: 'var(--accent2)' }} activeDot={{ r: 7 }} isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </ScrollReveal>
);

export default AnalyticsCard; 