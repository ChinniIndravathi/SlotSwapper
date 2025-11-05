import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, signup as apiSignup } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      if (isSignup) {
        const r = await apiSignup({ name, email, password });
        if (r.token) {
          login(r.token, r.user);
          nav('/');
        } else setErr(r.message || 'Error');
      } else {
        const r = await apiLogin({ email, password });
        if (r.token) {
          login(r.token, r.user);
          nav('/');
        } else setErr(r.message || 'Error');
      }
    } catch (err) {
      setErr('Network error');
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>{isSignup ? 'Sign up' : 'Log in'}</h2>
      <form onSubmit={submit} className="card">
        {isSignup && <div><label>Name</label><input value={name} onChange={e => setName(e.target.value)} /></div>}
        <div><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        <div style={{ marginTop: 8 }}>
          <button type="submit">{isSignup ? 'Sign up' : 'Log in'}</button>
          <button type="button" onClick={() => setIsSignup(s => !s)}>{isSignup ? 'Switch to login' : 'Switch to signup'}</button>
        </div>
        {err && <div style={{ color: 'red' }}>{err}</div>}
      </form>
    </div>
  );
}
