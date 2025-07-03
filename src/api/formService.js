const API_BASE_URL = process.env.REACT_APP_BASE_URL;

export async function submitForm(data) {
  try {
    console.log('data:', data);
    const res = await fetch(`${API_BASE_URL}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
}

export async function getSubmissions(siteKey) {
  try {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/submissions?siteKey=${siteKey}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { submissions: [], error: 'Network error' };
  }
}

export async function getAnalytics(siteKey) {
  try {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/analytics?siteKey=${siteKey}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { count: 0, latestSubmission: null, error: 'Network error' };
  }
} 