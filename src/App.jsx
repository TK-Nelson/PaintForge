import React, { useState, useMemo } from 'react';
import { Search, Filter, Menu, Heart, ShoppingCart, Bell } from 'lucide-react';
import PaintCard from './components/PaintCard';
import SideMenu from './components/SideMenu';
import FilterModal from './components/FilterModal';
import paints from './data/paints';

// Helper function to categorize paint colors by name or hex
const getColorCategory = (paint) => {
  const name = paint.name.toLowerCase();
  const hex = paint.hexColor?.toLowerCase() || '';

  if (name.includes('red') || ['#dc143c', '#dd482b'].includes(hex)) return 'red';
  if (name.includes('blue') || ['#1f56aa', '#295a8a', '#1f8f9c'].includes(hex)) return 'blue';
  if (name.includes('green') || ['#2ecc40'].includes(hex)) return 'green';
  if (name.includes('black') || ['#1c1c1c'].includes(hex)) return 'black';
  if (name.includes('grey') || name.includes('gray') || ['#a4a7a8', '#636769'].includes(hex)) return 'grey';
  if (name.includes('brown') || ['#a67c52'].includes(hex)) return 'brown';
  // Add more mappings as needed
  return '';
};

const PaintDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('library');
  const [showSideMenu, setShowSideMenu] = useState(false);

  // Store filter modal state
  const [filterState, setFilterState] = useState({
    color: '',
    sortBy: 'name', // Default to Alphabetical
    brand: '',
    paintType: '',
  });

  // Handle filter modal apply
  const handleApplyFilters = (filters) => {
    setFilterState(filters);
  };

  // Handle filter modal clear
  const handleClearFilters = () => {
    setFilterState({
      color: '',
      sortBy: '',
      brand: '',
      paintType: '',
    });
  };

  // Filtering logic
  const filteredPaints = useMemo(() => {
    return paints
      .filter(paint => {
        // Search filter
        const matchesSearch =
          paint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paint.brand.toLowerCase().includes(searchTerm.toLowerCase());

        // Tab filter
        const matchesTab =
          selectedFilter === '' || // <-- Show all paints if filter is empty (initial load or Paint Library)
          selectedFilter === 'all' ||
          (selectedFilter === 'owned' && paint.isOwned) ||
          (selectedFilter === 'favorites' && paint.isFavorite);

        // Brand filter
        const matchesBrand =
          !filterState.brand || paint.brand === filterState.brand;

        // Paint type filter
        const matchesType =
          !filterState.paintType || paint.type === filterState.paintType;

        // Color filter
        const matchesColor =
          !filterState.color || getColorCategory(paint) === filterState.color;

        return (
          matchesSearch &&
          matchesTab &&
          matchesBrand &&
          matchesType &&
          matchesColor
        );
      })
      .sort((a, b) => {
        if (filterState.sortBy === 'brand') {
          return a.brand.localeCompare(b.brand);
        }
        if (filterState.sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (filterState.sortBy === 'name-desc') {
          return b.name.localeCompare(a.name);
        }
        if (filterState.sortBy === 'color') {
          return getColorCategory(a).localeCompare(getColorCategory(b));
        }
        return 0;
      });
  }, [searchTerm, selectedFilter, filterState]);

  // Helper to count active filters (excluding defaults)
  const getActiveFilterCount = () => {
    let count = 0;
    // Only count if not default
    if (filterState.sortBy && filterState.sortBy !== 'name') count++;
    if (filterState.brand && filterState.brand !== '') count++;
    if (filterState.paintType && filterState.paintType !== '') count++;
    if (filterState.color && filterState.color !== '') count++;
    return count;
  };

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
        <div className="bg-white border-b border-gray-200 px-4 flex items-center lg:min-h-16">
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
                  setSelectedFilter(tab.id === 'library' ? '' : tab.id);
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
          <div className="flex items-center justify-between p-4 lg:min-h-16">
            <h2 className="text-lg font-semibold text-gray-900">Paints</h2>
            <div className="flex items-center space-x-3">
              <div className="relative w-32 sm:w-40 md:w-56 lg:w-64">
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
                className="ml-2 p-2 rounded-full hover:bg-gray-100 relative"
              >
                <Filter className="w-5 h-5 text-gray-500" />
                {getActiveFilterCount() > 0 && (
                  <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow">
                    {getActiveFilterCount()}
                  </span>
                )}
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
        {showFilters && (
          <FilterModal
            setShowFilters={setShowFilters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            currentFilters={filterState}
          />
        )}
      </div>
    </div>
  );
};

const App = () => <PaintDashboard />;

export default App;