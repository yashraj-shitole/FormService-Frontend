import React, { useState } from 'react';
import { submitForm } from '../api/formService';

// Default theme options
const defaultTheme = {
  shape: 'rounded', // 'rounded', 'square', 'pill'
  shadow: 'outer',  // 'none', 'outer', 'inner', 'strong', 'subtle'
  color: 'light',   // 'light', 'dark', 'accent'
  font: 'Segoe UI', // 'Segoe UI', 'Roboto', 'Arial'
  accentColor: '#76ABAE',
};

const getShapeStyle = (shape) => {
  switch (shape) {
    case 'square': return '0px';
    case 'pill': return '999px';
    case 'rounded':
    default: return '16px';
  }
};

const getShadowStyle = (shadow) => {
  switch (shadow) {
    case 'none': return 'none';
    case 'inner': return 'inset 0 2px 8px rgba(80,80,180,0.10)';
    case 'strong': return '0 8px 32px rgba(80,80,180,0.18)';
    case 'subtle': return '0 2px 8px rgba(80,80,180,0.07)';
    case 'outer':
    default: return '0 4px 24px rgba(80,80,180,0.10)';
  }
};

const getColorScheme = (color, accentColor) => {
  switch (color) {
    case 'dark':
      return {
        background: '#23272f',
        text: '#fff',
        inputBg: '#2c313a',
        inputText: '#fff',
        border: '#444',
        accent: accentColor || '#76ABAE',
      };
    case 'accent':
      return {
        background: accentColor || '#76ABAE',
        text: '#fff',
        inputBg: '#fff',
        inputText: '#222',
        border: accentColor || '#76ABAE',
        accent: accentColor || '#76ABAE',
      };
    case 'light':
    default:
      return {
        background: '#fff',
        text: '#222',
        inputBg: '#fff',
        inputText: '#222',
        border: '#31363F',
        accent: accentColor || '#76ABAE',
      };
  }
};

const FormWidget = ({ siteKey: propSiteKey, theme: propTheme }) => {
  // Initialize form state with all fields from theme.fields
  const mergedTheme = { ...defaultTheme, ...propTheme };
  const fields = mergedTheme.fields || [
    { name: 'name', label: 'Name', type: 'text', required: true, visible: true },
    { name: 'email', label: 'Email', type: 'email', required: true, visible: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true, visible: true },
  ];
  const initialFormState = Object.fromEntries(fields.map(f => [f.name, '']));
  const [form, setForm] = useState(initialFormState);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const siteKey = propSiteKey || localStorage.getItem('siteKey') || '';
  const theme = propTheme || {};
  const colorScheme = getColorScheme(mergedTheme.color, mergedTheme.accentColor);
  const widgetClass = 'form-widget-root';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    console.log('form:', form);
    const data = await submitForm({ ...form, siteKey });
    if (data.success) {
      setStatus('success');
      setForm(initialFormState); // Reset all fields
    } else {
      setStatus('error');
      setError(data.error || 'Submission failed');
    }
  };

  // Inline styles for theme
  const formStyle = {
    background: mergedTheme.cardBg || colorScheme.background,
    borderRadius: getShapeStyle(mergedTheme.shape),
    boxShadow: getShadowStyle(mergedTheme.shadow),
    fontFamily: mergedTheme.font,
    color: mergedTheme.text || colorScheme.text,
    border: mergedTheme.cardBorder ? `1px solid ${mergedTheme.cardBorder}` : undefined,
    padding: mergedTheme.cardPadding || 24,
    ...mergedTheme.customFormStyle,
  };
  const inputStyle = {
    background: mergedTheme.inputBg || colorScheme.inputBg,
    color: mergedTheme.inputText || colorScheme.inputText,
    border: mergedTheme.inputBorder ? `1px solid ${mergedTheme.inputBorder}` : `1px solid ${colorScheme.border}`,
    borderRadius: getShapeStyle(mergedTheme.shape),
    fontSize: mergedTheme.inputFontSize || 15,
    fontFamily: mergedTheme.font,
    padding: '10px 12px',
    marginBottom: 6,
  };
  const labelStyle = {
    color: mergedTheme.inputLabelColor || colorScheme.accent,
    fontWeight: 600,
    fontSize: 14,
    fontFamily: mergedTheme.font,
  };
  const buttonStyle = {
    background: mergedTheme.accentColor || colorScheme.accent,
    color: mergedTheme.buttonTextColor || '#fff',
    border: mergedTheme.buttonBorder || 'none',
    borderRadius: getShapeStyle(mergedTheme.shape),
    fontSize: mergedTheme.buttonFontSize || 16,
    fontWeight: 700,
    fontFamily: mergedTheme.font,
    padding: '12px 0',
    boxShadow: isButtonHovered
      ? (mergedTheme.color === 'dark'
          ? '0 4px 24px rgba(90, 90, 90, 0.32)'
          : '0 4px 24px rgba(61, 61, 61, 0.8)')
      : '0 2px 8px rgba(34,40,49,0.08)',
    marginTop: 8,
    cursor: 'pointer',
  };

  // Inject custom CSS if provided
  const customCss = mergedTheme.customCss ? (
    <style>{mergedTheme.customCss}</style>
  ) : null;

  return (
    <div
      className={widgetClass + ' w-full max-w-lg mx-auto flex flex-col gap-4'}
      style={formStyle}
      onSubmit={handleSubmit}
    >
      {customCss}
      <h2
        className="mb-2"
        style={{
          color: mergedTheme.headerColor || colorScheme.accent,
          fontSize: mergedTheme.headerFontSize || 22,
          fontWeight: 700,
          fontFamily: mergedTheme.font,
        }}
      >
        {mergedTheme.headerText || 'Contact Us'}
      </h2>
      {fields.filter(f => f.visible).map(field => (
        <div key={field.name} className="flex flex-col gap-1">
          <label htmlFor={field.name} style={labelStyle}>
            {field.label}{field.required && <span style={{ color: '#76ABAE' }}>*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              style={inputStyle}
              value={form[field.name] || ''}
              onChange={handleChange}
              className="min-h-[80px]"
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
              style={inputStyle}
              value={form[field.name] || ''}
              onChange={handleChange}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        onClick={handleSubmit}
        style={buttonStyle}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        {mergedTheme.buttonText || 'Send Message'}
      </button>
      {mergedTheme.showFooter && (
        <div className="text-xs text-[color:var(--text-secondary)] text-center mt-4" style={{ fontFamily: mergedTheme.font }}>
          {mergedTheme.footerText || 'Made with love by FormService'}
        </div>
      )}
      {status === 'success' && <div className="text-green-500 text-center mt-2">Thank you for your submission!</div>}
      {status === 'error' && <div className="text-pink-500 text-center mt-2">{error}</div>}
    </div>
  );
};

export default FormWidget; 