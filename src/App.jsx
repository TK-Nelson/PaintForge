import React, { useState, useMemo } from 'react';
import { Search, Filter, Menu, Heart, ShoppingCart, Bell } from 'lucide-react';
import PaintCard from './components/PaintCard';
import SideMenu from './components/SideMenu';
import FilterModal from './components/FilterModal';
import paints from './data/paints';

const PaintDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('library');
  const [showSideMenu, setShowSideMenu] = useState(false);

  // Filter paints based on search and filters
  const filteredPaints = useMemo(() => {
    return paints.filter(paint => {
      const matchesSearch = paint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paint.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' ||
        (selectedFilter === 'owned' && paint.isOwned) ||
        (selectedFilter === 'favorites' && paint.isFavorite);
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Side Menu */}
      <SideMenu
        showSideMenu={showSideMenu}
        setShowSideMenu={setShowSideMenu}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedFilter={setSelectedFilter}
      />

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
        {showFilters && <FilterModal setShowFilters={setShowFilters} />}
      </div>
    </div>
  );
};

export default PaintDashboard;