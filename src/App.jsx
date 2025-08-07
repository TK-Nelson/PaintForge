import React, { useState, useMemo } from 'react';
import { Search, Filter, Menu, Heart, ShoppingCart, Camera, Bell } from 'lucide-react';


// Sample paint data based on your mobile screens
const samplePaints = [
  {
    id: 1,
    name: "Abaddon Black",
    brand: "Citadel",
    type: "Base",
    code: "21-25",
    hexColor: "#1C1C1C",
    isFavorite: true,
    isOwned: true
  },
  {
    id: 2,
    name: "Adeptus Battlegrey",
    brand: "Citadel",
    type: "Old Colour Air",
    code: "22-50",
    hexColor: "#636769",
    isFavorite: false,
    isOwned: false
  },
  {
    id: 3,
    name: "Administratum Grey",
    brand: "Citadel",
    type: "Layer",
    code: "22-50",
    hexColor: "#A4A7A8",
    isFavorite: false,
    isOwned: true
  },
  {
    id: 4,
    name: "Agrax Earthshade",
    brand: "Citadel",
    type: "Shade",
    code: "22-50",
    hexColor: "#A67C52",
    isFavorite: false,
    isOwned: true
  },
  {
    id: 5,
    name: "Ahriman Blue",
    brand: "Citadel",
    type: "Layer",
    code: "22-76",
    hexColor: "#1F8F9C",
    isFavorite: true,
    isOwned: false
  },
  {
    id: 6,
    name: "Alaitok Blue",
    brand: "Citadel",
    type: "Layer",
    code: "22-13",
    hexColor: "#295A8A",
    isFavorite: false,
    isOwned: true
  },
  {
    id: 7,
    name: "Altdorf Guard Blue",
    brand: "Citadel",
    type: "Layer",
    code: "22-15",
    hexColor: "#1F56AA",
    isFavorite: false,
    isOwned: false
  },
  {
    id: 8,
    name: "Angron Red Clear",
    brand: "Citadel",
    type: "Model Air",
    code: "28-55",
    hexColor: "#DC143C",
    isFavorite: false,
    isOwned: true
  },
  {
    id: 9,
    name: "Astorath Red",
    brand: "Citadel",
    type: "Dry",
    code: "23-12",
    hexColor: "#DD482B",
    isFavorite: false,
    isOwned: false
  }
];

const PaintDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('library');
  const [showSideMenu, setShowSideMenu] = useState(false);

  // Filter paints based on search and filters
  const filteredPaints = useMemo(() => {
    return samplePaints.filter(paint => {
      const matchesSearch = paint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           paint.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || 
                           (selectedFilter === 'owned' && paint.isOwned) ||
                           (selectedFilter === 'favorites' && paint.isFavorite);
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);

  const PaintCard = ({ paint }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center p-4">
        <div 
          className="w-12 h-12 rounded-lg flex-shrink-0 border border-gray-300"
          style={{ backgroundColor: paint.hexColor }}
        />
        <div className="ml-4 flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {paint.name}
            </h3>
            <div className="flex items-center space-x-2 ml-2">
              {paint.isFavorite && (
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              )}
              {paint.isOwned && (
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {paint.brand}® {paint.type}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {paint.code}
          </p>
        </div>
      </div>
    </div>
  );

  const SideMenu = () => (
    <>
      {/* Overlay */}
      {showSideMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSideMenu(false)}
        />
      )}
      
      {/* Side Menu */}
      <div className={`
        fixed top-0 left-0 h-screen bg-white z-50 transform transition-transform duration-300 ease-in-out
        ${showSideMenu ? 'translate-x-0' : '-translate-x-full'}
        w-3/4 lg:w-64 lg:translate-x-0 lg:relative lg:z-auto
      `}>
        {/* Logo */}
        <div className="p-4 border-r border-gray-200 flex items-center" style={{ minHeight: '64px' }}>
          {/* LOGO */}
          <h2 className="text-lg font-semibold text-gray-900">Paint Forge</h2>
        </div>
        
        <nav className="p-4 h-fill border-r">
          <div className="space-y-2">
            {[
              { id: 'library', label: 'Paint Library', icon: '🎨' },
              { id: 'owned', label: 'My Paints', icon: '📦' },
              { id: 'favorites', label: 'Favorites', icon: '❤️' },
              { id: 'camera', label: 'Camera', icon: '📷' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedFilter(item.id === 'library' ? 'all' : item.id);
                  setShowSideMenu(false);
                }}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </>
  );

  const FilterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl p-6 max-h-96 mx-4">
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

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Side Menu */}
      <SideMenu />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 flex items-center" style={{ minHeight: '64px' }}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <button 
                onClick={() => setShowSideMenu(true)}
                className="lg:hidden mr-3"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-semibold lg:hidden">Paint Forge</h1>
              <h1 className="text-lg font-semibold hidden lg:block">
                {activeTab === 'library' ? 'Paint Library' : 
                 activeTab === 'owned' ? 'My Paints' : 
                 activeTab === 'favorites' ? 'Favorites' : 'Camera'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                  JD
                </div>
                <span className="hidden lg:inline text-gray-700 font-medium text-sm">John Doe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Mobile Only */}
        <div className="bg-white border-gray-200 lg:hidden">
          <div className="flex">
            {[
              { id: 'library', label: 'Paint Library', icon: '🎨' },
              { id: 'owned', label: 'My Paints', icon: '📦' },
              { id: 'favorites', label: 'Favorites', icon: '❤️' },
              { id: 'camera', label: 'Camera', icon: '📷' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedFilter(tab.id === 'library' ? 'all' : tab.id);
                }}
                className={`flex-1 flex flex-col items-center py-3 px-2 ${
                  activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
                }`}
              >
                <span className="text-lg mb-1">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Paint Grid */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4" style={{ minHeight: '64px' }}>
            <h2 className="text-lg font-semibold text-gray-900">Paints</h2>
            <div className="flex items-center space-x-3">
              <div className="relative w-40">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <button
                onClick={() => setShowFilters(true)}
                className="ml-2 p-2 rounded-full hover:bg-gray-100"
              >
                <Filter className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
            {/* Grid Items */}
          <div className="space-y-3">
            {filteredPaints.map(paint => (
              <PaintCard key={paint.id} paint={paint} />
            ))}
          </div>
          
          {filteredPaints.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No paints found</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation - Mobile Only */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white lg:hidden">
          <div className="flex">
            {[
              { icon: '🎨', label: 'Paints', active: true },
              { icon: '📋', label: 'Projects', active: false },
              { icon: '⚙️', label: 'Preferences', active: false }
            ].map((item, index) => (
              <button
                key={index}
                className={`flex-1 flex flex-col items-center py-3 ${
                  item.active ? 'text-blue-400' : 'text-gray-400'
                }`}
              >
                <span className="text-lg mb-1">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Modal */}
        {showFilters && <FilterModal />}
      </div>
    </div>
  );
};

export default PaintDashboard;