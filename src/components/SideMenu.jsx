import React from 'react';
import { useNavigate } from 'react-router-dom';

const SideMenu = ({
  showSideMenu,
  setShowSideMenu,
  activeTab,
  setActiveTab,
  setSelectedFilter,
  onLibraryClick
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay for mobile */}
      {showSideMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSideMenu(false)}
        />
      )}
      {/* Sticky Side Menu */}
      <div className={`
        lg:sticky lg:top-0 h-screen bg-white z-50 border-r
        w-3/4 lg:w-64
        ${showSideMenu ? 'fixed transform translate-x-0' : 'fixed transform -translate-x-full'}
        transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
      `}>
        <div className="p-4 border-r border-gray-200 flex items-center" style={{ minHeight: '64px' }}>
          <h2 className="text-lg font-semibold text-gray-900">Paint Forge</h2>
        </div>
        <nav className="p-4 h-fill">
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
                  setSelectedFilter(item.id === 'library' ? '' : item.id);
                  setShowSideMenu(false);
                  if (item.id === 'library') {
                    if (onLibraryClick) {
                      onLibraryClick();
                    } else {
                      navigate('/');
                    }
                  }
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
};

export default SideMenu;