const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

function authHeader() {
  const token = localStorage.getItem('token');
  return token
    ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

// AUTH
export async function signup(payload) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
}

export async function login(payload) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
}

// EVENTS
export async function getMyEvents() {
  const res = await fetch(`${API_BASE}/events/me`, {
    headers: authHeader()
  });
  return res.json();
}

export async function createEvent(payload) {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: authHeader()
  });
  return res.json();
}

export async function updateEvent(id, payload) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: authHeader()
  });
  return res.json();
}

// MARKETPLACE
export async function getSwappable() {
  const res = await fetch(`${API_BASE}/swaps/swappable-slots`, {
    headers: authHeader()
  });
  return res.json();
}

// SWAP REQUESTS
export async function createSwapRequest(payload) {
  const res = await fetch(`${API_BASE}/swaps/swap-request`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: authHeader()
  });
  return res.json();
}

export async function getRequests() {
  const res = await fetch(`${API_BASE}/swaps/requests`, {
    headers: authHeader()
  });
  return res.json();
}

export async function respondSwap(id, accept) {
  const res = await fetch(`${API_BASE}/swaps/swap-response/${id}`, {
    method: 'POST',
    body: JSON.stringify({ accept }),
    headers: authHeader()
  });
  return res.json();
}
