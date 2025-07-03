import React from 'react';
import { createRoot } from 'react-dom/client';
import FormWidget from './FormWidget';

// Helper to fetch theme by siteKey
async function fetchTheme(siteKey) {
  const API_URL = (window.FORM_SERVICE_API_URL || 'http://localhost:5000/api');
  const res = await fetch(`${API_URL}/theme/${siteKey}`);
  if (!res.ok) return {};
  const data = await res.json();
  return data.theme || {};
}

window.renderFormWidget = async function ({ siteKey, mountId }) {
  const mountNode = document.getElementById(mountId);
  if (!mountNode) {
    console.error(`FormWidget: No element found with id '${mountId}'`);
    return;
  }
  // Show loading while fetching theme
  const root = createRoot(mountNode);
  root.render(<div style={{textAlign:'center',padding:'2em'}}>Loading form...</div>);
  const theme = await fetchTheme(siteKey);
  root.render(<FormWidget siteKey={siteKey} theme={theme} />);
};