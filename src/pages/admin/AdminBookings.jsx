import { useState, useEffect } from 'react';
import { adminFetch } from '../../context/AuthContext';

const STATUSES = ['All', 'pending', 'confirmed', 'completed', 'cancelled'];

const STATUS_COLORS = {
  pending:   { bg:'#fffbeb', color:'#b45309' },
  confirmed: { bg:'#f0fdf4', color:'#15803d' },
  completed: { bg:'#f1f5f9', color:'#475569' },
  cancelled: { bg:'#fef2f2', color:'#b91c1c' },
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('All');

  function load() {
    const url = filter === 'All'
      ? '/api/admin/bookings.php'
      : `/api/admin/bookings.php?status=${filter}`;

    adminFetch(url)
      .then(r => r.json())
      .then(d => { if (d.success) setBookings(d.data); })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [filter]);

  async function updateStatus(id, status) {
    await adminFetch('/api/admin/bookings.php', {
      method: 'PUT',
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this booking?')) return;
    await adminFetch(`/api/admin/bookings.php?id=${id}`, { method: 'DELETE' });
    load();
  }

  const th = { padding:'12px 16px',textAlign:'left',fontWeight:600,fontSize:'12px',color:'#64748b',textTransform:'uppercase',letterSpacing:'0.05em',borderBottom:'1px solid #e2e8f0' };
  const td = { padding:'14px 16px',color:'#64748b' };

  return (
    <div style={{ padding:'28px',background:'#f8fafc',minHeight:'100vh' }}>
      <div style={{ marginBottom:'24px' }}>
        <h2 style={{ margin:'0 0 4px',fontSize:'22px',fontWeight:700,color:'#1e293b' }}>Manage Bookings</h2>
        <p style={{ margin:0,fontSize:'14px',color:'#64748b' }}>View and manage all vehicle bookings</p>
      </div>

      {/* Status filter pills */}
      <div style={{ display:'flex',gap:'8px',marginBottom:'20px',flexWrap:'wrap' }}>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding:'7px 16px',borderRadius:'20px',border:'1px solid',
            borderColor: filter === s ? '#2563eb' : '#e2e8f0',
            background: filter === s ? '#2563eb' : '#fff',
            color: filter === s ? '#fff' : '#64748b',
            fontSize:'13px',fontWeight:500,cursor:'pointer',textTransform:'capitalize',
          }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ background:'#fff',borderRadius:'10px',border:'1px solid #e2e8f0',overflow:'hidden' }}>
        <table style={{ width:'100%',borderCollapse:'collapse',fontSize:'14px' }}>
          <thead>
            <tr style={{ background:'#f8fafc' }}>
              {['ID','Customer','Vehicle','Start','End','Total','Status','Actions'].map(h => <th key={h} style={th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ padding:'24px',textAlign:'center',color:'#64748b' }}>Loading...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan="8" style={{ padding:'24px',textAlign:'center',color:'#64748b' }}>No bookings found</td></tr>
            ) : bookings.map((b, i) => {
              const s = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
              return (
                <tr key={b.id} style={{ borderBottom: i < bookings.length-1 ? '1px solid #f1f5f9' : 'none' }}>
                  <td style={{ ...td, fontWeight:500,color:'#1e293b' }}>#{b.id}</td>
                  <td style={{ ...td, color:'#1e293b' }}>{b.user_name}</td>
                  <td style={td}>{b.vehicle_name}</td>
                  <td style={td}>{b.start_date}</td>
                  <td style={td}>{b.end_date}</td>
                  <td style={td}>NPR {Number(b.total_price).toLocaleString()}</td>
                  <td style={td}>
                    <select
                      value={b.status}
                      onChange={e => updateStatus(b.id, e.target.value)}
                      style={{ padding:'4px 8px',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'12px',fontWeight:600,background:s.bg,color:s.color,cursor:'pointer' }}
                    >
                      {['pending','confirmed','completed','cancelled'].map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </td>
                  <td style={td}>
                    <button onClick={() => handleDelete(b.id)} style={{ background:'none',border:'1px solid #fecaca',borderRadius:'6px',padding:'6px 10px',cursor:'pointer',color:'#b91c1c' }}>🗑</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
