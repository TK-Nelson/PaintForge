import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaintDetailsPopup = ({ paint, onClose }) => {
  const navigate = useNavigate();

  if (!paint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{paint.name}</h3>
        <button className="py-2 px-4 rounded hover:bg-gray-100 text-left" onClick={() => { /* Synthesize logic */ onClose(); }}>
          Synthesize from Owned
        </button>
        <button className="py-2 px-4 rounded hover:bg-gray-100 text-left" onClick={() => { /* Compare logic */ onClose(); }}>
          Compare to...
        </button>
        <button className="py-2 px-4 rounded hover:bg-gray-100 text-left" onClick={() => { /* Add to My Paints logic */ onClose(); }}>
          Add to My Paints
        </button>
        <button className="py-2 px-4 rounded hover:bg-gray-100 text-left" onClick={() => { /* Add to Favorites logic */ onClose(); }}>
          Add to Favorites
        </button>
        <button className="py-2 px-4 rounded hover:bg-gray-100 text-left" onClick={() => { /* Add to Cart logic */ onClose(); }}>
          Add to Cart
        </button>
        <button className="py-2 px-4 rounded hover:bg-gray-100 text-left" onClick={() => { /* Add to Project logic */ onClose(); }}>
          Add to Project
        </button>
        <button
          className="py-2 px-4 rounded hover:bg-gray-100 text-left"
          onClick={() => {
            navigate(`/paints/${paint.id}`);
            onClose();
          }}
        >
          Color Details
        </button>
        <div className="flex justify-end mt-6">
          <button className="text-blue-600 font-medium mr-4" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaintDetailsPopup;