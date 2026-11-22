const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const getToken = () => {
  try { return localStorage.getItem('token') } catch { return null }
}

// POST {{BASE_URL}}/api/auth/login -> { accessToken, ... }
export async function login(account, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.accessToken) {
    throw new Error(data.message || 'Login failed')
  }
  try { localStorage.setItem('token', data.accessToken) } catch {}
  return data
}

// Authenticated multipart upload (the browser sets the Content-Type boundary itself)
export async function apiUpload(path, formData) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`)
  return data
}

// Authenticated request helper, e.g. apiFetch('/api/opportunities')
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res.json()
}
