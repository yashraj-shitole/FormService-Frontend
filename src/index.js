import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/theme.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add ripple effect to all .btn elements on click
document.addEventListener('click', function (e) {
  const target = e.target.closest('.btn');
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  target.appendChild(ripple);
  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
}, false);

