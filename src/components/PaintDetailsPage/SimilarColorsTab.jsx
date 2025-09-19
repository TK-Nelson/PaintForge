import React from 'react';
import { Heart, Package, Circle, Filter, Info } from 'lucide-react';

const SimilarColorsTab = ({
  paint,
  paints,
  onSimilarClick,
  hexToLab,
  DeltaE,
  onInfoClick
}) => {
  // Determine comparison set based on paint type
  let comparisonPaints;
  const type = paint.type ? paint.type.toLowerCase() : '';

  if (type.includes('metallic') || paint.isMetallic) {
    // Only compare metallics to metallics
    comparisonPaints = paints.filter(
      p => p.id !== paint.id && (p.isMetallic || (p.type && p.type.toLowerCase().includes('metallic')))
    );
  } else if (type === 'shade') {
    // Only compare shades to shades
    comparisonPaints = paints.filter(
      p => p.id !== paint.id && p.type && p.type.toLowerCase() === 'shade'
    );
  } else {
    // Compare to all non-metallic, non-shade paints (excluding self)
    comparisonPaints = paints.filter(
      p =>
        p.id !== paint.id &&
        !(p.isMetallic || (p.type && p.type.toLowerCase().includes('metallic'))) &&
        (!p.type || p.type.toLowerCase() !== 'shade')
    );
  }

  const getSimilarPaints = (currentPaint, allPaints, threshold = 15) => {
    const currentLab = hexToLab(currentPaint.baseHexColor || currentPaint.hexColor);

    const results = allPaints
      .map(paint => {
        const lab = hexToLab(paint.baseHexColor || paint.hexColor);
        const delta = DeltaE.getDeltaE00(
          { L: currentLab[0], A: currentLab[1], B: currentLab[2] },
          { L: lab[0], A: lab[1], B: lab[2] }
        );
        return { ...paint, deltaE: delta };
      })
      .sort((a, b) => a.deltaE - b.deltaE);

    // Always log the top 5 closest paints, even if none are within the threshold
    if (results.length > 0) {
      console.log(
        `Top closest paints by Delta E (comparison set: ${
          type.includes('metallic') || paint.isMetallic
            ? 'metallics'
            : type === 'shade'
            ? 'shades'
            : 'all non-metallic, non-shade paints'
        }):`
      );
      results.slice(0, 5).forEach((p, i) =>
        console.log(`${i + 1}. ${p.name} (ΔE: ${p.deltaE.toFixed(2)})`)
      );
    } else {
      console.log(
        'No similar colors found in the allowed comparison set for this paint type.'
      );
    }

    // Only return those within the threshold for display
    return results.filter(paint => paint.deltaE <= threshold);
  };

  const similarPaints = getSimilarPaints(paint, comparisonPaints);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-base font-semibold text-gray-900">Similar Colors</span>
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            title="What is Delta E?"
            onClick={onInfoClick}
          >
            <Info className="w-5 h-5 text-blue-600" />
          </button>
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
      {similarPaints.length === 0 ? (
        <div className="text-center text-gray-500 text-sm mt-8">
          No similar colors found in the allowed comparison set for this paint type. There are no paints close enough to <b>{paint.name}</b> in our database.
        </div>
      ) : (
        similarPaints.map(similar => (
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
        ))
      )}
    </div>
  );
};

export default SimilarColorsTab;