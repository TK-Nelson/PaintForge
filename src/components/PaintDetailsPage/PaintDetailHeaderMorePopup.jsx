import React from 'react';

const PaintDetailHeaderMorePopup = ({
  paint,
  isOwned,
  isFavorite,
  onToggleOwned,
  onToggleFavorite,
  onClose
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{paint.name}</h3>
      <button
        className="py-2 px-4 rounded hover:bg-gray-100 text-left"
        onClick={() => {
          onToggleOwned();
          onClose();
        }}
      >
        {isOwned ? 'Remove from My Paints' : 'Add to My Paints'}
      </button>
      <button
        className="py-2 px-4 rounded hover:bg-gray-100 text-left"
        onClick={() => {
          onToggleFavorite();
          onClose();
        }}
      >
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
      <div className="flex justify-end mt-6">
        <button className="text-blue-600 font-medium mr-4" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default PaintDetailHeaderMorePopup;