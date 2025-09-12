import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paints from '../data/paints';
import SideMenu from '../components/SideMenu';
import { ShoppingCart, Bell, Heart, Package, Filter, Circle } from 'lucide-react';
import DeltaE from 'delta-e';
import PaintActionPopup from '../components/PaintDetailsPage/PaintDetailsPopup';


// Helper to convert hex to LAB (delta-e expects LAB)
import { hexToLab } from '../utils/color'; // You'll need to create this helper

const TABS = ['Similar Color', 'Compare', 'Recipes', 'Details'];

const PaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const paint = paints.find(p => p.id === Number(id));
  const [tab, setTab] = React.useState(TABS[0]);
  const [animate, setAnimate] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSimilar, setSelectedSimilar] = useState(null);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
    return () => setAnimate(false);
  }, [id]);

  const getSimilarPaints = (currentPaint, allPaints, threshold = 10) => {
    // Determine comparison group
    let filterFn = () => true;
    if (currentPaint.colorGrouping && currentPaint.colorGrouping.toLowerCase().includes("metalic")) {
      filterFn = p =>
        p.id !== currentPaint.id &&
        p.colorGrouping &&
        p.colorGrouping.toLowerCase().includes("metalic");
    } else if (currentPaint.type && currentPaint.type.toLowerCase().includes("shade")) {
      filterFn = p =>
        p.id !== currentPaint.id &&
        p.type &&
        p.type.toLowerCase().includes("shade");
    } else {
      filterFn = p =>
        p.id !== currentPaint.id &&
        (!p.colorGrouping || !p.colorGrouping.toLowerCase().includes("metalic")) &&
        (!p.type || !p.type.toLowerCase().includes("shade"));
    }

    const currentLab = hexToLab(currentPaint.baseHexColor || currentPaint.hexColor);

    const results = allPaints
      .filter(filterFn)
      .map(paint => {
        const lab = hexToLab(paint.baseHexColor || paint.hexColor);
        const delta = DeltaE.getDeltaE00(
          { L: currentLab[0], A: currentLab[1], B: currentLab[2] },
          { L: lab[0], A: lab[1], B: lab[2] }
        );
        return { ...paint, deltaE: delta };
      })
      .filter(paint => paint.deltaE <= threshold)
      .sort((a, b) => a.deltaE - b.deltaE);

    return results;
  };

  if (!paint) return <div>Paint not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Side Menu (visible on desktop) */}
      <SideMenu
        showSideMenu={showSideMenu}
        setShowSideMenu={setShowSideMenu}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedFilter={setSelectedFilter}
        onLibraryClick={() => navigate('/')}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation (visible on desktop) */}
        <div className="bg-white border-b border-gray-200 px-4 flex items-center justify-between lg:min-h-16">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 font-medium mr-4"
          >
            &lt; Back
          </button>
          <div className="flex-1" />
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

        {/* Paint Detail Component */}
        <div
          className={`
            fixed inset-0 z-50 bg-white flex flex-col h-full
            transition-transform duration-300 ease-in-out
            ${animate ? 'translate-x-0' : 'translate-x-full'}
             lg:translate-x-0 lg:relative
          `}
          style={{ boxShadow: '0 0 24px 0 rgba(0,0,0,0.08)' }}
        >
          {/* Colored Header */}
          <div
            className="
              px-4 py-6
              flex flex-col justify-center
              min-h-[120px]
              lg:min-h-0
              lg:h-[40vh] lg:max-h-[calc(100vh-4rem)] lg:py-0
            "
            style={{
              background: paint.hexColor,
              color: '#fff',
              height: 'auto',
              ...(window.innerWidth >= 1024
                ? { minHeight: '40vh', height: '40vh' }
                : {}),
            }}
          >
            <h2 className="text-xl font-bold">{paint.name}</h2>
            <div className="text-sm">{paint.brand} &bull; {paint.type}</div>
            <div className="text-xs">{paint.code}</div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            {TABS.map(t => (
              <button
                key={t}
                className={`flex-1 py-2 text-center ${tab === t ? 'border-b-2 border-white font-semibold' : 'text-gray-500'}`}
                style={tab === t ? { color: paint.hexColor } : {}}
                onClick={() => setTab(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {tab === 'Similar Color' && (
              <div>
                {/* Header with title, color wheel, and filter button */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold text-gray-900">Similar Colors</span>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      title="Set color relationships"
                    >
                      <Circle className="w-5 h-5 text-gray-500" />
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      title="Filter similar colors"
                    >
                      <Filter className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
                {getSimilarPaints(paint, paints).map(similar => (
                  <div
                    key={similar.id}
                    className="mb-2 flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow px-3 py-2 cursor-pointer"
                    onClick={() => {
                      setSelectedSimilar(similar);
                      setShowPopup(true);
                    }}
                  >
                    {/* Swatch: 48px square with similar color, 24px square centered with selected color */}
                    <div
                      className="relative w-12 h-12 rounded mr-3 border"
                      style={{
                        background: similar.hexColor
                      }}
                    >
                      <div
                        className="absolute top-1/2 left-1/2 rounded"
                        style={{
                          width: 24,
                          height: 24,
                          background: paint.hexColor,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 truncate">{similar.name}</span>
                        <div className="flex items-center space-x-2 ml-2">
                          {similar.isFavorite && (
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                          )}
                          {similar.isOwned && (
                            <Package className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {similar.brand}® {similar.type}
                      </span>
                    </div>
                    <span className="ml-2 text-xs text-gray-500 flex-shrink-0">ΔE {similar.deltaE.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'Compare' && <div>Comparison UI here...</div>}
            {tab === 'Recipes' && <div>Recipes here...</div>}
            {tab === 'Details' && (
              <div>
                <div><b>Finish Type:</b> {paint.finishType || 'Matte'}</div>
                <div><b>Type:</b> {paint.type}</div>
                <div><b>Barcode Number:</b> {paint.code}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup for Paint Action (e.g., Add to Favorites, View Recipe) */}
      {showPopup && selectedSimilar && (
        <PaintActionPopup paint={selectedSimilar} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default PaintDetail;