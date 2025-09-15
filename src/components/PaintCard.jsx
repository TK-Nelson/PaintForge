import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package } from 'lucide-react';
import { lighten, darken, makeMetallicGradient, makeShadeGradient } from '../utils/color';

const PaintCard = ({ paint, isOwned, isFavorite }) => {
  const isShade = paint.type && paint.type.toLowerCase() === 'shade';
  const isMetallic = paint.isMetallic; // or whatever your metallic check is

  let background = paint.hexColor;
  if (isShade && /^#[0-9a-f]{6}$/i.test(paint.hexColor)) {
    background = makeShadeGradient(paint.hexColor);
  } else if (isMetallic && /^#[0-9a-f]{6}$/i.test(paint.hexColor)) {
    background = makeMetallicGradient(paint.hexColor);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/paints/${paint.id}`} className="block">
        <div className="flex items-center p-4">
          <div
            className="w-12 h-12 rounded-lg flex-shrink-0 border border-gray-300"
            style={{ background }}
          />
          <div className="ml-4 flex-1 min-w-0">
            <div className="flex items-center">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {paint.name}
              </h3>
              <div className="flex items-center space-x-2 ml-2">
                {isFavorite && (
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                )}
                {isOwned && (
                  <Package className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {paint.brand}® {paint.type}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {paint.code}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PaintCard;