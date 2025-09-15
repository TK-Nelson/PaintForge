import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paints from '../data/paints';
import SideMenu from '../components/SideMenu';
import { ShoppingCart, Bell, MoreHorizontal, Heart, Package } from 'lucide-react';
import PaintActionPopup from '../components/PaintDetailsPage/PaintDetailsPopup';
import RecipesTab, { getRecipeCombinations } from '../components/PaintDetailsPage/RecipesTab';
import SimilarColorsTab from '../components/PaintDetailsPage/SimilarColorsTab';
import DeltaE from 'delta-e';
import { hexToLab } from '../utils/color';
import PaintDetailHeaderMorePopup from '../components/PaintDetailsPage/PaintDetailHeaderMorePopup';
import { usePaintUser } from '../context/PaintUserContext';

const TABS = ['Similar Color', 'Recipes', 'Details'];

const PaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const paint = paints.find(p => p.id === Number(id));
  const [tab, setTab] = React.useState(TABS[0]);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSimilar, setSelectedSimilar] = useState(null);
  const [recipes, setRecipes] = React.useState(null);
  const [showHeaderPopup, setShowHeaderPopup] = useState(false);
  const context = usePaintUser();
  console.log('Context in PaintDetails:', context);

  if (!context) {
    return <div>Context not found. Make sure PaintUserProvider wraps your app.</div>;
  }

  const { account, myPaints, favoritePaints, setMyPaints, setFavoritePaints } = context;

  const isOwned = account
    ? account.myPaints && account.myPaints.includes(paint.id)
    : myPaints.includes(paint.id);
  const isFavorite = account
    ? account.favoritePaints && account.favoritePaints.includes(paint.id)
    : favoritePaints.includes(paint.id);

  useEffect(() => {
    setRecipes(null);
    if (paint && paints) {
      setTimeout(() => {
        setRecipes(getRecipeCombinations(paint, paints));
      }, 0);
    }
  }, [paint, paints]);

  

  if (!paint) return <div>Paint not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row">
      {/* Left Navigation */}
      <div className="hidden lg:block lg:sticky lg:top-0 h-screen z-50">
        <SideMenu
          showSideMenu={showSideMenu}
          setShowSideMenu={setShowSideMenu}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedFilter={setSelectedFilter}
        />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Sticky Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 flex items-center justify-between min-h-16 sticky top-0 z-40">
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
        {/* Paint Details Header */}
        <div
          className="
            px-4 py-6
            flex flex-col justify-center relative
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
          <h2 className="text-xl font-bold flex items-center">
            {paint.name}
            {isFavorite && (
              <Heart className="w-5 h-5 text-red-500 ml-2" fill="currentColor" />
            )}
            {isOwned && (
              <Package className="w-5 h-5 text-green-500 ml-2" />
            )}
          </h2>
          <div className="text-sm">{paint.brand} &bull; {paint.type}</div>
          <div className="text-xs">{paint.code}</div>
          {/* More Button */}
          <button
            className="absolute top-4 right-4 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition"
            onClick={() => setShowHeaderPopup(true)}
            title="More"
          >
            <MoreHorizontal className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        {/* Tab Navigation */}
        <div className="bg-white border-gray-200">
          <div className="flex">
            {TABS.map(t => (
              <button
                key={t}
                className={`flex-1 py-2 text-center ${tab === t ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
                onClick={() => setTab(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {tab === 'Similar Color' && (
            <SimilarColorsTab
              paint={paint}
              paints={paints}
              onSimilarClick={similar => {
                setSelectedSimilar(similar);
                setShowPopup(true);
              }}
              hexToLab={hexToLab}
              DeltaE={DeltaE}
            />
          )}
          {tab === 'Recipes' && <RecipesTab paint={paint} paints={paints} />}
          {tab === 'Details' && (
            <div>
              <div><b>Finish Type:</b> {paint.finishType || 'Matte'}</div>
              <div><b>Type:</b> {paint.type}</div>
              <div><b>Barcode Number:</b> {paint.code}</div>
              <div><b>Hex Code:</b> {paint.baseHexColor || paint.hexColor}</div>
              <div>
                <b>RGB Code:</b> {
                  (() => {
                    const hex = (paint.baseHexColor || paint.hexColor).replace('#', '');
                    if (hex.length === 6) {
                      const r = parseInt(hex.substring(0,2), 16);
                      const g = parseInt(hex.substring(2,4), 16);
                      const b = parseInt(hex.substring(4,6), 16);
                      return `rgb(${r}, ${g}, ${b})`;
                    }
                    return 'N/A';
                  })()
                }
              </div>
            </div>
          )}
        </div>
        {/* Popup for More actions */}
        {showHeaderPopup && (
          <PaintDetailHeaderMorePopup
            paint={paint}
            isOwned={isOwned}
            isFavorite={isFavorite}
            onToggleOwned={() => {
              if (account) {
                // Update account logic here
              } else {
                setMyPaints(list =>
                  isOwned
                    ? list.filter(pid => pid !== paint.id)
                    : [...list, paint.id]
                );
              }
            }}
            onToggleFavorite={() => {
              if (account) {
                // Update account logic here
              } else {
                setFavoritePaints(list =>
                  isFavorite
                    ? list.filter(pid => pid !== paint.id)
                    : [...list, paint.id]
                );
              }
            }}
            onClose={() => setShowHeaderPopup(false)}
          />
        )}
      </div>
      {showPopup && selectedSimilar && (
        <PaintActionPopup paint={selectedSimilar} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default PaintDetail;