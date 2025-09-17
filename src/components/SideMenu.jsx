import React from 'react';
import { X } from 'lucide-react';
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
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-40 transition-opacity duration-200 ${
          showSideMenu ? 'block' : 'hidden'
        } lg:hidden`}
        onClick={() => setShowSideMenu(false)}
      />
      {/* Drawer */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white z-50
          transition-transform duration-300
          border-r border-gray-200
          ${showSideMenu ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:block lg:fixed
          lg:top-0 lg:left-0 lg:h-screen
        `}
        style={{ maxWidth: '80vw' }}
      >
        {/* Logo and close button area */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 min-h-[64px]">
          <span className="text-lg font-semibold">Paint Forge</span>
          {/* Show close button only on mobile */}
          <button
            onClick={() => setShowSideMenu(false)}
            aria-label="Close menu"
            className="p-2 rounded hover:bg-gray-100 lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Menu content */}
        <nav className="pt-4 lg:pt-8">
          {[
            {
              id: 'library',
              label: 'Paint Library',
              icon: '🎨'
            },
            {
              id: 'owned',
              label: 'My Paints',
              icon: '📦'
            },
            {
              id: 'favorites',
              label: 'Favorites',
              icon: '❤️'
            }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSelectedFilter(item.id === 'library' ? '' : item.id);
                setShowSideMenu(false); // Close menu on selection (mobile)
                if (item.id === 'library') {
                  if (onLibraryClick) {
                    onLibraryClick();
                  } else {
                    navigate('/');
                  }
                }
              }}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default SideMenu;