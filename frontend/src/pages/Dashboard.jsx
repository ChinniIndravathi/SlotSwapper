import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyEvents, createEvent, updateEvent, getSwappable, getRequests } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [newEv, setNewEv] = useState({ title: '', startTime: '', endTime: '' });
  const { logout, user } = useAuth();

  async function load() {
    const me = await getMyEvents();
    setEvents(me || []);
  }

  useEffect(() => { load(); }, []);

  async function addEvent(e) {
    e.preventDefault();
    await createEvent(newEv);
    setNewEv({ title: '', startTime: '', endTime: '' });
    await load();
  }

  async function toggleSwappable(ev) {
    const newStatus = ev.status === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE';
    await updateEvent(ev._id, { status: newStatus });
    await load();
  }

  return (
    <div style={{ maxWidth: 900, margin: '12px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Dashboard</h2>
        <div>
          <Link to="/marketplace"><button>Marketplace</button></Link>
          <Link to="/requests"><button>Requests</button></Link>
          <button onClick={() => { logout(); }}>Logout</button>
        </div>
      </div>

      <section className="card">
        <h3>Create Event</h3>
        <form onSubmit={addEvent}>
          <div><input placeholder="Title" value={newEv.title} onChange={e => setNewEv({ ...newEv, title: e.target.value })} /></div>
          <div><input placeholder="Start ISO (e.g. 2025-11-06T10:00:00)" value={newEv.startTime} onChange={e => setNewEv({ ...newEv, startTime: e.target.value })} /></div>
          <div><input placeholder="End ISO" value={newEv.endTime} onChange={e => setNewEv({ ...newEv, endTime: e.target.value })} /></div>
          <div style={{ marginTop: 8 }}><button type="submit">Create</button></div>
        </form>
      </section>

      <section className="card">
        <h3>Your Events</h3>
        {events.length ? events.map(ev => (
          <div key={ev._id} className="card">
            <div><strong>{ev.title}</strong></div>
            <div>{new Date(ev.startTime).toLocaleString()} → {new Date(ev.endTime).toLocaleString()}</div>
            <div>Status: {ev.status}</div>
            <div style={{ marginTop: 6 }}>
              <button onClick={() => toggleSwappable(ev)}>{ev.status === 'SWAPPABLE' ? 'Make Busy' : 'Make Swappable'}</button>
            </div>
          </div>
        )) : <div>No events yet</div>}
      </section>
    </div>
  );
}
