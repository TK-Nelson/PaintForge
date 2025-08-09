import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paints from '../data/paints';

const TABS = ['Similar Color', 'Compare', 'Recipes', 'Details'];

export default function PaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const paint = paints.find(p => p.id === Number(id));
  const [tab, setTab] = React.useState(TABS[0]);

  if (!paint) return <div>Paint not found</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="px-4 py-6"
        style={{ backgroundColor: paint.hexColor, color: '#fff' }}
      >
        <button onClick={() => navigate(-1)} className="mb-2 text-white">&lt; Back</button>
        <h2 className="text-xl font-bold">{paint.name}</h2>
        <div className="text-sm">{paint.brand} &bull; {paint.type}</div>
        <div className="text-xs">{paint.code}</div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {TABS.map(t => (
          <button
            key={t}
            className={`flex-1 py-2 text-center ${tab === t ? 'border-b-2 border-white font-semibold' : 'text-gray-500'}`}
            style={tab === t ? { color: paint.hexColor } : {}}
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {tab === 'Similar Color' && <div>Similar colors here...</div>}
        {tab === 'Compare' && <div>Comparison UI here...</div>}
        {tab === 'Recipes' && <div>Recipes here...</div>}
        {tab === 'Details' && (
          <div>
            <div><b>Finish Type:</b> {paint.finishType || 'Matte'}</div>
            <div><b>Type:</b> {paint.type}</div>
            <div><b>Barcode Number:</b> {paint.code}</div>
            {/* Add more details as needed */}
          </div>
        )}
      </div>
    </div>
  );
}