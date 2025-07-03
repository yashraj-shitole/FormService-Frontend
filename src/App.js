import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import FormWidget from './widget/FormWidget';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

function RequireAuth({ children }) {
  const token = sessionStorage.getItem('token');
  const lastActivity = parseInt(sessionStorage.getItem('lastActivity'), 10);
  const now = Date.now();
  const THIRTY_MIN = 30 * 60 * 1000;
  if (!token) return <Navigate to="/login" replace />;
  if (!lastActivity || now - lastActivity > THIRTY_MIN) {
    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }
  sessionStorage.setItem('lastActivity', now.toString());
  return children;
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function WidgetPage() {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const siteKey = sessionStorage.getItem('siteKey');
  useEffect(() => {
    async function fetchTheme() {
      if (!siteKey) {
        setLoading(false);
        return;
      }
      const API_URL = window.FORM_SERVICE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/theme/${siteKey}`);
      if (res.ok) {
        const data = await res.json();
        setTheme(data.theme || {});
      }
      setLoading(false);
    }
    fetchTheme();
  }, [siteKey]);
  if (loading) return <div className="flex justify-center items-center min-h-[40vh]">Loading widget...</div>;
  return (
    <div className="flex justify-center items-center min-h-[80vh] py-8 px-2 md:px-0">
      <FormWidget siteKey={siteKey} theme={theme || undefined} />
    </div>
  );
}

function Toast({ message }) {
  return (
    <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 50 }}>
      <div className="bg-[color:var(--accent)] text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-base animate-fade-in-out">
        {message}
      </div>
    </div>
  );
}

function OAuthCallback() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const siteKey = params.get('siteKey');
    if (token && siteKey) {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('siteKey', siteKey);
      sessionStorage.setItem('lastActivity', Date.now().toString());
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/dashboard');
      }, 1200);
    } else {
      navigate('/login');
    }
  }, [navigate]);
  return (
    <>
      {showToast && <Toast message="Logged in!" />}
      <div className="flex justify-center items-center min-h-[60vh] text-lg">Logging you in with Google...</div>
    </>
  );
}

function App() {
  const storedSiteKey = localStorage.getItem('siteKey');

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />
            <Route path="/widget" element={<WidgetPage />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
