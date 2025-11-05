import React, { useEffect, useState } from 'react';
import { getRequests, respondSwap } from '../api';
import { Link } from 'react-router-dom';

export default function RequestsPage() {
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });

  async function load() {
    const r = await getRequests();
    setRequests(r || { incoming: [], outgoing: [] });
  }

  useEffect(() => { load(); }, []);

  async function respond(id, accept) {
    await respondSwap(id, accept);
    await load();
  }

  return (
    <div style={{ maxWidth: 900, margin: '12px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Requests</h2>
        <div>
          <Link to="/"><button>Dashboard</button></Link>
          <Link to="/marketplace"><button>Marketplace</button></Link>
        </div>
      </div>

      <section className="card">
        <h3>Incoming</h3>
        {requests.incoming && requests.incoming.length ? requests.incoming.map(r => (
          <div key={r._id} className="card">
            <div>From: {r.requester?.name}</div>
            <div>Their Offer: {r.mySlot?.title} ({new Date(r.mySlot?.startTime).toLocaleString()})</div>
            <div>Your Slot: {r.theirSlot?.title} ({new Date(r.theirSlot?.startTime).toLocaleString()})</div>
            <div>Status: {r.status}</div>
            {r.status === 'PENDING' && <div><button onClick={() => respond(r._id, true)}>Accept</button><button onClick={() => respond(r._id, false)}>Reject</button></div>}
          </div>
        )) : <div>No incoming requests</div>}
      </section>

      <section className="card">
        <h3>Outgoing</h3>
        {requests.outgoing && requests.outgoing.length ? requests.outgoing.map(r => (
          <div key={r._1d} className="card">
            <div>To: {r.requestedTo?.name}</div>
            <div>Your Offer: {r.mySlot?.title}</div>
            <div>Their Slot: {r.theirSlot?.title}</div>
            <div>Status: {r.status}</div>
          </div>
        )) : <div>No outgoing requests</div>}
      </section>
    </div>
  );
}
