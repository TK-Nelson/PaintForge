import React, { useState, useRef } from 'react';

// Utility to determine if a color is "light" or "dark" for contrast
function getContrastYIQ(hexcolor) {
  // Remove hash if present
  hexcolor = hexcolor.replace('#', '');
  // Convert 3-digit hex to 6-digit
  if (hexcolor.length === 3) {
    hexcolor = hexcolor.split('').map(x => x + x).join('');
  }
  const r = parseInt(hexcolor.substr(0,2),16);
  const g = parseInt(hexcolor.substr(2,2),16);
  const b = parseInt(hexcolor.substr(4,2),16);
  // YIQ formula
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  return yiq >= 128 ? 'black' : 'white';
}

const COLOR_CATEGORIES = [
  { name: 'Brown', value: 'brown', color: '#A67C52' },
  { name: 'Flesh', value: 'flesh', color: '#FFDAB9' },
  { name: 'Red', value: 'red', color: '#DC143C' },
  { name: 'Orange', value: 'orange', color: '#FF9900' },
  { name: 'Yellow', value: 'yellow', color: '#FFD600' },
  { name: 'Blue', value: 'blue', color: '#1F56AA' },
  { name: 'Bone', value: 'bone', color: '#E3DAC9' },
  { name: 'Green', value: 'green', color: '#2ECC40' },
  { name: 'Purple', value: 'purple', color: '#8E44AD' },
  { name: 'Pink', value: 'pink', color: '#FF69B4' },
  { name: 'Black', value: 'black', color: '#1C1C1C' },
  { name: 'White', value: 'white', color: '#FFFFFF' },
  { name: 'Grey', value: 'grey', color: '#A4A7A8' },
  { name: 'Silver', value: 'silver', color: '#C0C0C0' },
  { name: 'Gold', value: 'gold', color: '#FFD700' },
  { name: 'Copper', value: 'copper', color: '#B87333' },
  { name: 'Brass', value: 'brass', color: '#B5A642' },
  { name: 'Bronze', value: 'bronze', color: '#CD7F32' }
];

const FilterModal = ({ setShowFilters, onApply, onClear, currentFilters }) => {
  const [selectedColor, setSelectedColor] = useState(currentFilters?.color || '');
  const [sortBy, setSortBy] = useState(currentFilters?.sortBy || 'name');
  const [brand, setBrand] = useState(currentFilters?.brand || '');
  const [paintType, setPaintType] = useState(currentFilters?.paintType || '');

  const modalRef = useRef(null);

  // Close modal if clicking outside of the modal content
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowFilters(false);
    }
  };

  const handleApply = () => {
    onApply({
      color: selectedColor,
      sortBy,
      brand,
      paintType,
    });
    setShowFilters(false);
  };

  const handleClear = () => {
    setSelectedColor('');
    setSortBy('name');
    setBrand('');
    setPaintType('');
    if (onClear) onClear();
    setShowFilters(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onMouseDown={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-xl p-6 mx-4 lg:max-h-none max-h-96 overflow-y-auto"
        onMouseDown={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">List Filters</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="name">Alphabetical, Ascending</option>
              <option value="name-desc">Alphabetical, Descending</option>
              <option value="brand">Brand Name</option>
              <option value="color">Color</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              value={brand}
              onChange={e => setBrand(e.target.value)}
            >
              <option value="">All</option>
              <option value="Citadel">Citadel</option>
              <option value="Vallejo">Vallejo</option>
              <option value="Army Painter">Army Painter</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paint Type</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              value={paintType}
              onChange={e => setPaintType(e.target.value)}
            >
              <option value="">All</option>
              <option value="Base">Base</option>
              <option value="Layer">Layer</option>
              <option value="Shade">Shade</option>
              <option value="Dry">Dry</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_CATEGORIES.map(color => {
                const isSelected = selectedColor === color.value;
                // For selected, use the color as background, so contrast is with color.color
                // For unselected, background is white, so contrast is with white
                const fontColor = isSelected
                  ? getContrastYIQ(color.color) === 'black' ? 'text-black' : 'text-white'
                  : 'text-black';
                const borderColor = isSelected ? `border-[${color.color}]` : 'border-gray-300';
                const bgColor = isSelected ? '' : 'bg-white';
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(isSelected ? '' : color.value)}
                    className={`
                      inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset
                      border ${borderColor} ${bgColor} ${fontColor}
                      transition focus:outline-none
                      ${isSelected ? 'shadow' : ''}
                    `}
                    style={{
                      borderColor: isSelected ? color.color : undefined,
                      backgroundColor: isSelected ? color.color : undefined,
                      borderWidth: '1.5px',
                      cursor: 'pointer'
                    }}
                    aria-pressed={isSelected}
                    aria-label={color.name}
                  >
                    <span
                      className="flex-none rounded-full h-1.5 w-1.5"
                      style={{
                        backgroundColor: isSelected ? '#2563eb' : color.color // #2563eb is Tailwind blue-600
                      }}
                    />
                    {color.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex space-x-2 mt-6">
          <button
            onClick={handleClear}
            className="flex-1 py-3 text-blue-600 font-medium"
            type="button"
          >
            CLEAR
          </button>
          <button
            onClick={() => setShowFilters(false)}
            className="flex-1 py-3 text-blue-600 font-medium"
            type="button"
          >
            CANCEL
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium"
            type="button"
          >
            APPLY
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;