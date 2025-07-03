import React, { useEffect, useRef, useState } from 'react';
import { getTheme, saveTheme } from '../api/ownerService';
import FormWidget from '../widget/FormWidget';

// Uses .card, .btn, and .input classes for modern UI consistency

const shapeOptions = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'square', label: 'Square' },
  { value: 'pill', label: 'Pill' },
];
const shadowOptions = [
  { value: 'outer', label: 'Outer' },
  { value: 'inner', label: 'Inner' },
  { value: 'strong', label: 'Strong' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'none', label: 'None' },
];
const colorOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'accent', label: 'Accent' },
];
const fontOptions = [
  { value: 'Segoe UI', label: 'Segoe UI' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Arial', label: 'Arial' },
];

const defaultTheme = {
  shape: 'rounded',
  shadow: 'outer',
  color: 'light',
  font: 'Segoe UI',
  accentColor: '#76ABAE',
  buttonGradient2: '#76ABAE',
  buttonText: 'Send Message',
  buttonFontSize: 18,
  buttonTextColor: '#fff',
  buttonBorder: 'none',
  inputBg: '#fff',
  inputBorder: '#31363F',
  inputLabelColor: '#76ABAE',
  inputFontSize: 15,
  cardBg: '#fff',
  cardBorder: '#31363F',
  cardPadding: 28,
  headerText: 'Contact Us',
  headerFontSize: 22,
  headerColor: '#76ABAE',
  showFooter: true,
  footerText: 'Made with love by Yashraj Shitole',
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true, visible: true },
    { name: 'email', label: 'Email', type: 'email', required: true, visible: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true, visible: true },
  ],
};

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'dropdown', label: 'Dropdown' },
];

const numberFields = [
  'buttonFontSize', 'inputFontSize', 'cardPadding', 'headerFontSize'
];

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

const parentVariants = {
  visible: { transition: { staggerChildren: 0.13 } },
  hidden: {},
};
const childVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

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

// Move useBounceOnScroll to a global effect for all .scrollable elements
function useGlobalBounceOnScroll() {
  React.useEffect(() => {
    function addBounce(el) {
      let ticking = false;
      const handleScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const atTop = el.scrollTop === 0;
          const atBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
          if ((atTop && el._lastScroll < 0) || (atBottom && el._lastScroll > 0)) {
            el.classList.add('bounce-y');
            setTimeout(() => el.classList.remove('bounce-y'), 500);
          }
          ticking = false;
        });
      };
      const handleWheel = (e) => {
        el._lastScroll = e.deltaY;
      };
      el.addEventListener('scroll', handleScroll);
      el.addEventListener('wheel', handleWheel);
      return () => {
        el.removeEventListener('scroll', handleScroll);
        el.removeEventListener('wheel', handleWheel);
      };
    }
    const scrollables = document.querySelectorAll('.scrollable');
    const cleanups = Array.from(scrollables).map(addBounce);
    return () => { cleanups.forEach(cleanup => cleanup && cleanup()); };
  }, []);
}

const ThemeCustomizer = ({ siteKey }) => {
  const [theme, setTheme] = useState(defaultTheme);
  const [saveStatus, setSaveStatus] = useState('idle');
  const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const isMobile = width <= 600;
  const isDesktop = width >= 1024;

  const scrollRef = useRef();
  useGlobalBounceOnScroll();

  useEffect(() => {
    async function fetchTheme() {
      const res = await getTheme();
      if (res.theme && Object.keys(res.theme).length > 0) {
        setTheme({ ...defaultTheme, ...res.theme });
      }
    }
    fetchTheme();
  }, []);

  const handleChange = async (e) => {
    const { name, value, type } = e.target;
    let newValue = value;
    if (type === 'number' || numberFields.includes(name)) {
      newValue = value === '' ? '' : Number(value);
    }
    if (type === 'checkbox') {
      newValue = e.target.checked;
    }
    let newTheme;
    if (name === 'color') {
      // When color scheme changes, reset cardBg to follow scheme
      newTheme = { ...theme, [name]: newValue, cardBg: '' };
    } else {
      newTheme = { ...theme, [name]: newValue };
    }
    setTheme(newTheme);
    setSaveStatus('saving');
    await saveTheme(newTheme);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1200);
  };

  const handleColorChange = async (e) => {
    const newTheme = { ...theme, [e.target.name]: e.target.value };
    setTheme(newTheme);
    setSaveStatus('saving');
    await saveTheme(newTheme);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1200);
  };

  const handleReset = async () => {
    setTheme(defaultTheme);
    setSaveStatus('saving');
    await saveTheme(defaultTheme);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1200);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const newTheme = { ...theme, logo: ev.target.result };
      setTheme(newTheme);
      setSaveStatus('saving');
      await saveTheme(newTheme);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1200);
    };
    reader.readAsDataURL(file);
  };

  const handleCustomCssChange = async (e) => {
    const newTheme = { ...theme, customCss: e.target.value };
    setTheme(newTheme);
    setSaveStatus('saving');
    await saveTheme(newTheme);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1200);
  };

  const embedCode = `<div id="my-form-widget"></div>\n<script src="https://your-cdn.com/form-widget.js"></script>\n<script>\n  window.renderFormWidget({\n    siteKey: '${siteKey}',\n    mountId: 'my-form-widget'\n  });\n<\/script>`;

  // Field management handlers
  const handleFieldChange = async (idx, key, value) => {
    const newFields = theme.fields.map((f, i) => i === idx ? { ...f, [key]: value } : f);
    const newTheme = { ...theme, fields: newFields };
    setTheme(newTheme);
    setSaveStatus('saving');
    await saveTheme(newTheme);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1200);
  };

  const handleFieldAdd = async () => {
    const newFields = [...theme.fields, { name: `field${theme.fields.length + 1}`, label: 'New Field', type: 'text', required: false, visible: true }];
    const newTheme = { ...theme, fields: newFields };
    setTheme(newTheme);
    setSaveStatus('saving');
    await saveTheme(newTheme);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1200);
  };

  const handleFieldRemove = async (idx) => {
    const newFields = theme.fields.filter((_, i) => i !== idx);
    const newTheme = { ...theme, fields: newFields };
    setTheme(newTheme);
    setSaveStatus('saving');
    await saveTheme(newTheme);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1200);
  };

  const handleFieldMove = async (idx, dir) => {
    const newFields = [...theme.fields];
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= newFields.length) return;
    [newFields[idx], newFields[swapIdx]] = [newFields[swapIdx], newFields[idx]];
    const newTheme = { ...theme, fields: newFields };
    setTheme(newTheme);
    setSaveStatus('saving');
    await saveTheme(newTheme);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1200);
  };

  // Helper for input/select/textarea style
  const getControlStyle = () => {
    let borderRadius = '0px';
    if (theme.shape === 'rounded') borderRadius = '16px';
    if (theme.shape === 'pill') borderRadius = '999px';
    if (theme.color === 'dark') {
      return {
        background: '#23272f',
        color: '#fff',
        border: '1px solid #444',
        borderRadius,
      };
    } else {
      return {
        background: '#fff',
        color: '#222',
        border: '1px solid #e0e0e0',
        borderRadius,
      };
    }
  };

  return (
    <>
      {/* Toast notification */}
      {saveStatus === 'saved' && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 50 }}>
          <div className="scrollable bg-[color:var(--accent)] text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-base animate-fade-in-out">
            Theme saved!
          </div>
        </div>
      )}
      <ScrollReveal>
        <div className="card w-full p-3 md:p-6 mb-8">
          <h2 className="text-[color:var(--accent)] font-semibold text-lg md:text-xl mb-4">Customize Your Widget</h2>
          <div className="flex flex-wrap-reverse md:flex-wrap lg:flex-col flex-row gap-4 md:gap-8 flex-wrap w-full">
            <div className="scrollable flex-1 min-w-[220px] max-h-[600px] pr-2">
          <ScrollReveal>
              <div className="mb-6 bg-[color:var(--bg)] rounded-lg p-4 border border-[color:var(--border)]">
                <div className="font-semibold mb-2 text-[color:var(--accent)]">Fields</div>
                <ScrollReveal>
                  <div variants={parentVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    {theme.fields.map((field, idx) => (
                      <ScrollReveal key={field.name + idx} className="flex flex-wrap items-center gap-2 mb-2">
                        <input className="input w-24 md:w-28" type="text" value={field.label} onChange={e => handleFieldChange(idx, 'label', e.target.value)} />
                        <select className="input w-24 md:w-28" value={field.type} onChange={e => handleFieldChange(idx, 'type', e.target.value)}>
                          {fieldTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={field.required} onChange={e => handleFieldChange(idx, 'required', e.target.checked)} /> Required</label>
                        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={field.visible} onChange={e => handleFieldChange(idx, 'visible', e.target.checked)} /> Show</label>
                        <button onClick={e => { handleFieldMove(idx, 'up'); createRipple(e); }} disabled={idx === 0}>↑</button>
                        <button onClick={e => { handleFieldMove(idx, 'down'); createRipple(e); }} disabled={idx === theme.fields.length - 1}>↓</button>
                        <button onClick={e => { handleFieldRemove(idx); createRipple(e); }} className="text-pink-500 font-bold text-xs border-none bg-transparent cursor-pointer">✕</button>
                      </ScrollReveal>
                    ))}
                  </div>
                </ScrollReveal>
                <button className="btn mt-1 py-2 px-6 text-sm w-full md:w-auto" onClick={e => { handleFieldAdd(); createRipple(e); }}>Add Field</button>
              </div>
              <div className="mb-6">
                <label>Shape:</label><br />
                <select name="shape" value={theme.shape} onChange={handleChange} className="input w-24 md:w-28">
                  {shapeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="mb-6">
                <label>Shadow:</label><br />
                <select name="shadow" value={theme.shadow} onChange={handleChange} className="input w-24 md:w-28">
                  {shadowOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="mb-6">
                <label>Color Scheme:</label><br />
                <select name="color" value={theme.color} onChange={handleChange} className="input w-24 md:w-28">
                  {colorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="mb-6">
                <label>Font:</label><br />
                <select name="font" value={theme.font} onChange={handleChange} className="input w-24 md:w-28">
                  {fontOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="mb-6">
                <label>Accent Color:</label><br />
                <input type="color" name="accentColor" value={theme.accentColor || defaultTheme.accentColor} onChange={handleColorChange} className="input w-24 md:w-28 h-12" />
                <span className="ml-2">{theme.accentColor}</span>
              </div>
              <div className="mb-6">
                <label>Button Text:</label><br />
                <input type="text" name="buttonText" value={theme.buttonText} onChange={handleChange} className="input w-24 md:w-28" />
              </div>
              <div className="mb-6">
                <label>Button Font Size:</label><br />
                <input type="number" name="buttonFontSize" value={theme.buttonFontSize} onChange={handleChange} min={10} max={32} className="input w-24 md:w-28" /> px
              </div>
              <div className="mb-6">
                <label>Button Text Color:</label><br />
                <input type="color" name="buttonTextColor" value={theme.buttonTextColor || defaultTheme.buttonTextColor} onChange={handleColorChange} className="input w-24 md:w-28 h-12" />
                <span className="ml-2">{theme.buttonTextColor}</span>
              </div>
              <div className="mb-6">
                <label>Button Border:</label><br />
                <input type="text" name="buttonBorder" value={theme.buttonBorder} onChange={handleChange} placeholder="e.g. 2px solid #6a82fb or none" className="input w-24 md:w-28" />
              </div>
              <div className="mb-6">
                <label>Input Background:</label><br />
                <input type="color" name="inputBg" value={theme.inputBg || (theme.color === 'dark' ? '#2c313a' : theme.color === 'accent' ? '#fff' : '#fff')} onChange={handleColorChange} className="input w-24 md:w-28 h-12" />
                <span className="ml-2">{theme.inputBg}</span>
              </div>
              <div className="mb-6">
                <label>Input Border Color:</label><br />
                <input type="color" name="inputBorder" value={theme.inputBorder || (theme.color === 'dark' ? '#444' : theme.color === 'accent' ? theme.accentColor || defaultTheme.accentColor : '#e0e0e0')} onChange={handleColorChange} className="input w-24 md:w-28 h-12" />
                <span className="ml-2">{theme.inputBorder}</span>
              </div>
              <div className="mb-6">
                <label>Input Label Color:</label><br />
                <input type="color" name="inputLabelColor" value={theme.inputLabelColor || (theme.color === 'accent' ? theme.accentColor || defaultTheme.accentColor : defaultTheme.inputLabelColor)} onChange={handleColorChange} className="input w-24 md:w-28 h-12" />
                <span className="ml-2">{theme.inputLabelColor}</span>
              </div>
              <div className="mb-6">
                <label>Input Font Size:</label><br />
                <input type="number" name="inputFontSize" value={theme.inputFontSize} onChange={handleChange} min={10} max={32} className="input w-24 md:w-28" /> px
              </div>
              <div className="mb-6">
                <label>Card Background:</label><br />
                <input type="color" name="cardBg" value={theme.cardBg || (theme.color === 'dark' ? '#23272f' : theme.color === 'accent' ? theme.accentColor || defaultTheme.accentColor : '#fff')} onChange={handleColorChange} className="input w-24 md:w-28 h-12" />
                <span className="ml-2">{theme.cardBg}</span>
              </div>
              <div className="mb-6">
                <label>Card Border Color:</label><br />
                <input type="color" name="cardBorder" value={theme.cardBorder || (theme.color === 'dark' ? '#444' : theme.color === 'accent' ? theme.accentColor || defaultTheme.accentColor : '#e0e0e0')} onChange={handleColorChange} className="input w-24 md:w-28 h-12" />
                <span className="ml-2">{theme.cardBorder}</span>
              </div>
              <div className="mb-6">
                <label>Card Padding:</label><br />
                <input type="number" name="cardPadding" value={theme.cardPadding} onChange={handleChange} min={0} max={64} className="input w-24 md:w-28" /> px
              </div>
              <div className="mb-6">
                <label>Header Text:</label><br />
                <input type="text" name="headerText" value={theme.headerText} onChange={handleChange} className="input w-24 md:w-28" />
              </div>
              <div className="mb-6">
                <label>Header Font Size:</label><br />
                <input type="number" name="headerFontSize" value={theme.headerFontSize} onChange={handleChange} min={12} max={48} className="input w-24 md:w-28" /> px
              </div>
              <div className="mb-6">
                <label>Header Color:</label><br />
                <input type="color" name="headerColor" value={theme.headerColor || (theme.color === 'accent' ? theme.accentColor || defaultTheme.accentColor : defaultTheme.headerColor)} onChange={handleColorChange} className="input w-24 md:w-28 h-12" />
                <span className="ml-2">{theme.headerColor}</span>
              </div>
              <div className="mb-6">
                <label>Show Footer:</label>
                <input type="checkbox" name="showFooter" checked={theme.showFooter} onChange={e => handleChange({ target: { name: 'showFooter', value: e.target.checked } })} className="input w-24 md:w-28" />
              </div>
              <div className="mb-6">
                <label>Footer Text:</label><br />
                <input type="text" name="footerText" value={theme.footerText} onChange={handleChange} className="input w-24 md:w-28" />
              </div>
              <div className="mb-6">
                <label>Logo (optional):</label><br />
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="input w-24 md:w-28" />
                {theme.logo && <div className="mt-2"><img src={theme.logo} alt="Logo preview" className="max-w-[120px] max-h-[60px] rounded-lg" /></div>}
              </div>
              <div className="mb-6">
                <label>Custom CSS (advanced):</label><br />
                <textarea
                  value={theme.customCss || ''}
                  onChange={handleCustomCssChange}
                  placeholder={"e.g. input { background: #f0f0f0; }"}
                  className="input w-full min-h-[60px] font-mono text-sm rounded border border-[color:var(--border)] p-4"
                />
              </div>
              <button className="btn mt-1 py-2 px-6 text-sm w-full md:w-auto" onClick={e => { handleReset(); createRipple(e); }}>Reset to Default</button>
            </ScrollReveal>
            </div>
            <div className="flex-1 min-w-[320px] lg:sticky lg:top-8 self-start">
              <div className="mb-2 font-medium text-[color:var(--text)]">Live Preview:</div>
              <ScrollReveal>
                <FormWidget siteKey={siteKey} theme={theme} />
              </ScrollReveal>
            </div>
          </div>
          <div className="mt-8">
            <div className="font-medium mb-2 text-[color:var(--text)]">Embed Code:</div>
            <textarea
              value={embedCode}
              readOnly
              className="input w-full min-h-[300px] font-mono text-sm rounded border border-[color:var(--border)] p-2 bg-[color:var(--input-bg)] text-[color:var(--text)]"
            />
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <a
                href="/dist/form-widget.js"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn px-6 py-2 font-semibold text-base bg-[color:var(--accent)] text-white rounded-lg shadow hover:opacity-90 transition"
              >
                Download Widget JS (CDN)
              </a>
              <span className="text-xs text-[color:var(--text-secondary)]">Or use the CDN link in your embed code above.</span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </>
  );
};

export default ThemeCustomizer; 