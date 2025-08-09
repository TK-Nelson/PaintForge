import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paints from '../data/paints';
import SideMenu from '../components/SideMenu';
import { ShoppingCart, Bell } from 'lucide-react';
import DeltaE from 'delta-e';

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

  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
    return () => setAnimate(false);
  }, [id]);

  const getSimilarPaints = (currentPaint, allPaints, threshold = 50) => {
    const currentLab = hexToLab(currentPaint.hexColor);

    const results = allPaints
      .filter(p => p.id !== currentPaint.id)
      .map(paint => {
        const lab = hexToLab(paint.hexColor);
        const delta = DeltaE.getDeltaE00(
          { L: currentLab[0], A: currentLab[1], B: currentLab[2] },
          { L: lab[0], A: lab[1], B: lab[2] }
        );
        return { ...paint, deltaE: delta };
      })
      .filter(paint => paint.deltaE <= threshold)
      .sort((a, b) => a.deltaE - b.deltaE);

    // Log results for debugging
    console.log('Similar paints (threshold 50):', results);

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
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation (visible on desktop) */}
        <div className="bg-white border-b border-gray-200 px-4 flex items-center justify-between lg:min-h-16">
          {/* Back Button */}
          <button
            onClick={() => {
              setAnimate(false);
              setTimeout(() => navigate(-1), 350);
            }}
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
            lg:static lg:translate-x-0 lg:relative
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
              backgroundColor: paint.hexColor,
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
                {getSimilarPaints(paint, paints).map(similar => (
                  <div key={similar.id} className="mb-2 flex items-center">
                    <div
                      className="w-6 h-6 rounded mr-2 border"
                      style={{ backgroundColor: similar.hexColor }}
                    />
                    <span>{similar.name}</span>
                    <span className="ml-2 text-xs text-gray-500">ΔE {similar.deltaE.toFixed(2)}</span>
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
    </div>
  );
};

export default PaintDetail;