import React, { useEffect, useState } from 'react';
import { getSwappable, getMyEvents, createSwapRequest } from '../api';
import { Link } from 'react-router-dom';

export default function Marketplace() {
  const [slots, setSlots] = useState([]);
  const [mySwappables, setMySwappables] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTheirSlot, setSelectedTheirSlot] = useState(null);

  async function load() {
    setSlots(await getSwappable());
    const mine = await getMyEvents();
    setMySwappables((mine || []).filter(e => e.status === 'SWAPPABLE'));
  }

  useEffect(() => { load(); }, []);

  async function openRequestModal(theirSlot) {
    setSelectedTheirSlot(theirSlot);
    const mine = await getMyEvents();
    setMySwappables((mine || []).filter(e => e.status === 'SWAPPABLE'));
    setModalOpen(true);
  }

  async function submitRequest(mySlotId) {
    if (!mySlotId || !selectedTheirSlot) return;
    await createSwapRequest({ mySlotId, theirSlotId: selectedTheirSlot._id });
    setModalOpen(false);
    setSelectedTheirSlot(null);
    await load();
  }

  return (
    <div style={{ maxWidth: 900, margin: '12px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Marketplace</h2>
        <div>
          <Link to="/"><button>Dashboard</button></Link>
          <Link to="/requests"><button>Requests</button></Link>
        </div>
      </div>

      <section className="card">
        <h3>Available Swappable Slots</h3>
        {slots.length ? slots.map(s => (
          <div key={s._id} className="card">
            <div><strong>{s.title}</strong> — by {s.owner?.name}</div>
            <div>{new Date(s.startTime).toLocaleString()} → {new Date(s.endTime).toLocaleString()}</div>
            <div><button onClick={() => openRequestModal(s)}>Request Swap</button></div>
          </div>
        )) : <div>No swappable slots</div>}
      </section>

      {modalOpen && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)'
        }}>
          <div style={{ background: '#fff', padding: 20, width: 500, borderRadius: 8 }}>
            <h3>Choose one of your SWAPPABLE slots to offer</h3>
            {mySwappables.length ? mySwappables.map(m => (
              <div key={m._id} className="card">
                <div><strong>{m.title}</strong></div>
                <div>{new Date(m.startTime).toLocaleString()} → {new Date(m.endTime).toLocaleString()}</div>
                <div><button onClick={() => submitRequest(m._id)}>Offer this slot</button></div>
              </div>
            )) : <div>You have no SWAPPABLE slots — mark one as swappable in your Dashboard</div>}
            <div style={{ marginTop: 8 }}><button onClick={() => { setModalOpen(false); setSelectedTheirSlot(null); }}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
