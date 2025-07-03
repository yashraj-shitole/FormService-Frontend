import React, { useRef } from 'react';

// Uses Tailwind CSS for modern UI consistency
const SubmissionList = ({ submissions, loading }) => {
  const ref = useRef();
  const scrollRef = useRef();

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

  useScrollReveal(ref);

  return (
    <ScrollReveal>
      <div className="scrollable card w-full p-3 md:p-6 mb-8">
        <h2 className="text-[color:var(--accent)] font-semibold text-lg md:text-xl mb-4">Inbox</h2>
        {loading ? (
          <div className="text-[color:var(--text-secondary)]">Loading...</div>
        ) : submissions.length === 0 ? (
          <div className="text-[color:var(--text-secondary)] text-base md:text-lg">No submissions yet.</div>
        ) : (
          <ul className="scrollable list-none p-0 m-0 max-h-96 overflow-y-auto">
            {submissions.map((s, i) => (
              <li key={s._id || i} className="border-b border-[color:var(--border)] py-2 md:py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                  {Object.entries(s).map(([key, value]) => (
                    key !== '_id' && key !== '__v' && (
                      <div key={key} className="flex">
                        <span className="font-semibold capitalize mr-2">{key}:</span>
                        <span>
                          {(key === 'createdAt' || key === 'updatedAt') && value ? new Date(value).toLocaleString() : String(value)}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ScrollReveal>
  );
};

export default SubmissionList; 