import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginOwner } from '../api/ownerService';

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

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = await loginOwner(form);
    setLoading(false);
    if (data.token && data.siteKey) {
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('siteKey', data.siteKey);
      sessionStorage.setItem('lastActivity', Date.now().toString());
      navigate('/dashboard');
    } else {
      setError(data.error || 'Login failed');
    }
  };

  const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const isMobile = width <= 600;
  return (
    <div className="card max-w-full md:max-w-md mx-auto my-8 md:my-16 rounded-lg md:rounded-xl shadow-lg p-4 md:p-8 font-sans w-full">
      <h2 className="text-[color:var(--accent)] mb-4 font-bold text-lg md:text-xl tracking-wide">Owner Login</h2>
      <a
        href={`${process.env.REACT_APP_BASE_URL}/api/auth/google`}
        className="btn w-full flex items-center justify-center gap-2 mb-4 bg-white text-[color:var(--accent)] border border-[color:var(--accent)] shadow-sm hover:bg-[color:var(--accent)] hover:text-white"
        style={{ fontWeight: 600 }}
        onClick={(e) => { createRipple(e); }}
      >
        <svg width="20" height="20" viewBox="0 0 48 48" fill="none"><g><path d="M44.5 20H24V28.5H36.5C35.1 33.1 30.9 36.5 25.5 36.5C19.2 36.5 14 31.3 14 25C14 18.7 19.2 13.5 25.5 13.5C28.2 13.5 30.7 14.5 32.7 16.2L38.1 10.8C34.7 7.8 30.3 6 25.5 6C14.8 6 6 14.8 6 25C6 35.2 14.8 44 25.5 44C35.2 44 44 35.2 44 25C44 23.7 44.8 21.7 44.5 20Z" fill="#FFC107"/><path d="M6 14.8L13.7 20.6C15.9 16.2 20.3 13.5 25.5 13.5C28.2 13.5 30.7 14.5 32.7 16.2L38.1 10.8C34.7 7.8 30.3 6 25.5 6C19.2 6 14 10.2 12.1 15.2L6 14.8Z" fill="#FF3D00"/><path d="M25.5 44C30.2 44 34.5 42.2 37.8 39.3L31.1 33.7C29.1 35.1 26.6 36 25.5 36.5C19.2 36.5 14 31.3 14 25C14 18.7 19.2 13.5 25.5 13.5C28.2 13.5 30.7 14.5 32.7 16.2L38.1 10.8C34.7 7.8 30.3 6 25.5 6C14.8 6 6 14.8 6 25C6 35.2 14.8 44 25.5 44Z" fill="#4CAF50"/><path d="M44.5 20H24V28.5H36.5C35.1 33.1 30.9 36.5 25.5 36.5C19.2 36.5 14 31.3 14 25C14 18.7 19.2 13.5 25.5 13.5C28.2 13.5 30.7 14.5 32.7 16.2L38.1 10.8C34.7 7.8 30.3 6 25.5 6C14.8 6 6 14.8 6 25C6 35.2 14.8 44 25.5 44C35.2 44 44 35.2 44 25C44 23.7 44.8 21.7 44.5 20Z" fill="#1976D2"/></g></svg>
        Continue with Google
      </a>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="input mb-1 w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="input mb-1 w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn w-full"
          onClick={(e) => { createRipple(e); }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className="text-pink-500 mt-2 text-center">{error}</div>}
      </form>
      <div className="text-xs text-gray-400 text-center mt-6">
        Don&apos;t have an account? <a href="/register" className="text-[color:var(--accent)] underline">Register</a>
      </div>
    </div>
  );
};

export default Login; 