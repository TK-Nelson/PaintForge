import React from 'react';

const FilterModal = ({ setShowFilters }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white w-full max-w-md rounded-xl p-6 mx-4 lg:max-h-none max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">List Filters</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
            <option>Brand Name</option>
            <option>Paint Name</option>
            <option>Color</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
            <option>All</option>
            <option>Citadel</option>
            <option>Vallejo</option>
            <option>Army Painter</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Paint Type</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
            <option>All</option>
            <option>Base</option>
            <option>Layer</option>
            <option>Shade</option>
            <option>Dry</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-4 mt-6">
        <button 
          onClick={() => setShowFilters(false)}
          className="flex-1 py-3 text-blue-600 font-medium"
        >
          CANCEL
        </button>
        <button 
          onClick={() => setShowFilters(false)}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium"
        >
          APPLY
        </button>
      </div>
    </div>
  </div>
);

export default FilterModal;