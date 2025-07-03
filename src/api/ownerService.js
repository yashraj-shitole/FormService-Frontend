const API_BASE_URL = process.env.REACT_APP_BASE_URL;

export async function registerOwner({ email, password }) {
  try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch (err) {
    return { error: 'Network error' };
  }
}

export async function loginOwner({ email, password }) {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch (err) {
    return { error: 'Network error' };
  }
}

export async function getTheme() {
  try {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/theme`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { theme: {}, error: 'Network error' };
  }
}

export async function saveTheme(theme) {
  try {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/theme`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ theme }),
    });
    return await res.json();
  } catch (err) {
    return { error: 'Network error' };
  }
} 