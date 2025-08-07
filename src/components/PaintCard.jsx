import { Heart } from 'lucide-react';

const PaintCard = ({ paint }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
    <div className="flex items-center p-4">
      <div 
        className="w-12 h-12 rounded-lg flex-shrink-0 border border-gray-300"
        style={{ backgroundColor: paint.hexColor }}
      />
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {paint.name}
          </h3>
          <div className="flex items-center space-x-2 ml-2">
            {paint.isFavorite && (
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            )}
            {paint.isOwned && (
              <div className="w-2 h-2 bg-green-500 rounded-full" />
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
  </div>
);

export default PaintCard;