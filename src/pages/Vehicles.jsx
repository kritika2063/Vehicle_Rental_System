import { useEffect, useState } from 'react';
import VehicleCard from '../component/VehicleCard';
import './Vehicles.css';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState('All');

  const types = ['All', 'Car', 'SUV', 'Van', 'Motorcycle', 'Truck'];

  useEffect(() => {
    fetch('/api/vehicles/get_vehicles.php')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setVehicles(data.vehicles);
        else setError('Failed to load vehicles.');
      })
      .catch(() => setError('Cannot connect to server.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeType === 'All'
    ? vehicles
    : vehicles.filter((v) => v.type === activeType);

  if (loading) return <div className="vehicles-state">Loading vehicles...</div>;
  if (error)   return <div className="vehicles-state vehicles-error">{error}</div>;

  return (
    <div className="vehicles-page">
      <div className="vehicles-header">
        <h2>Available Vehicles</h2>
        <p>Choose from our fleet and book your ride</p>
      </div>

      <div className="type-filters">
        {types.map((t) => (
          <button
            key={t}
            className={`type-pill${activeType === t ? ' active' : ''}`}
            onClick={() => setActiveType(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="vehicles-grid">
        {filtered.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
      </div>
    </div>
  );
}
