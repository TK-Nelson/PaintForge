import React from 'react';
import { useNavigate } from 'react-router-dom';

const SideMenu = ({
  showSideMenu,
  setShowSideMenu,
  activeTab,
  setActiveTab,
  setSelectedFilter,
  onLibraryClick // <-- add this prop
}) => {
  const navigate = useNavigate();

  return (
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
        fixed top-0 left-0 h-screen bg-white z-50  border-r transform transition-transform duration-300 ease-in-out
        ${showSideMenu ? 'translate-x-0' : '-translate-x-full'}
        w-3/4 lg:w-64 lg:translate-x-0 lg:relative lg:z-auto
      `}>
        {/* Logo */}
        <div className="p-4 border-r border-gray-200 flex items-center" style={{ minHeight: '64px' }}>
          {/* LOGO */}
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
                  setSelectedFilter(item.id === 'library' ? 'all' : item.id);
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
          <div className="border-t border-gray-200 mt-4 pt-4">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setActiveTab('library');
                setSelectedFilter('');
                if (onLibraryClick) {
                  onLibraryClick();
                } else {
                  navigate('/');
                }
              }}
            >
              Paint Library
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default SideMenu;