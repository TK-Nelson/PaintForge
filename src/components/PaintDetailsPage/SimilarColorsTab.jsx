import React from 'react';
import { Heart, Package, Circle, Filter } from 'lucide-react';

const SimilarColorsTab = ({
  paint,
  paints,
  onSimilarClick,
  hexToLab,
  DeltaE
}) => {
  const getSimilarPaints = (currentPaint, allPaints, threshold = 10) => {
    const currentLab = hexToLab(currentPaint.baseHexColor || currentPaint.hexColor);

    const results = allPaints
      .filter(p => p.id !== currentPaint.id)
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

  return (
    <div>
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
          onClick={() => onSimilarClick(similar)}
        >
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
  );
};

export default SimilarColorsTab;