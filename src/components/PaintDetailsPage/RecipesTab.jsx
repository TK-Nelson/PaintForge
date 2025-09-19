import React, { useEffect, useState } from 'react';
import DeltaE from 'delta-e';
import { hexToLab } from '../../utils/color';

// Helper to mix colors in given ratios
function mixColors(hexArr, ratios) {
  let r = 0, g = 0, b = 0, total = 0;
  hexArr.forEach((hex, i) => {
    hex = hex.replace('#', '');
    if (hex.length === 6) {
      r += parseInt(hex.substring(0,2),16) * ratios[i];
      g += parseInt(hex.substring(2,4),16) * ratios[i];
      b += parseInt(hex.substring(4,6),16) * ratios[i];
      total += ratios[i];
    }
  });
  r = Math.round(r / total);
  g = Math.round(g / total);
  b = Math.round(b / total);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

export function getRecipeCombinations(targetPaint, paints, threshold = 15, limit = 10) {
  const targetLab = hexToLab(targetPaint.baseHexColor || targetPaint.hexColor);
  const validPaints = paints.filter(
    p =>
      p.id !== targetPaint.id &&
      (!p.colorGrouping || !p.colorGrouping.toLowerCase().includes("metalic")) &&
      (!p.type || !p.type.toLowerCase().includes("shade"))
  );
  const recipes = [];

  // Combinations of 2 colors, try ratios 1:1, 2:1, 1:2
  for (let i = 0; i < validPaints.length; i++) {
    for (let j = i + 1; j < validPaints.length; j++) {
      const p1 = validPaints[i];
      const p2 = validPaints[j];
      const hex1 = (p1.baseHexColor || p1.hexColor);
      const hex2 = (p2.baseHexColor || p2.hexColor);
      [[1,1],[2,1],[1,2]].forEach(ratios => {
        const avgHex = mixColors([hex1, hex2], ratios);
        const avgLab = hexToLab(avgHex);
        const delta = DeltaE.getDeltaE00(
          { L: targetLab[0], A: targetLab[1], B: targetLab[2] },
          { L: avgLab[0], A: avgLab[1], B: avgLab[2] }
        );
        if (delta <= threshold) {
          recipes.push({
            paints: [p1, p2],
            ratios,
            avgHex,
            delta
          });
        }
      });
    }
  }

  // Combinations of 3 colors, try ratios [1,1,1], [2,1,1], [1,2,1], [1,1,2]
  for (let i = 0; i < validPaints.length; i++) {
    for (let j = i + 1; j < validPaints.length; j++) {
      for (let k = j + 1; k < validPaints.length; k++) {
        const p1 = validPaints[i];
        const p2 = validPaints[j];
        const p3 = validPaints[k];
        const hex1 = (p1.baseHexColor || p1.hexColor);
        const hex2 = (p2.baseHexColor || p2.hexColor);
        const hex3 = (p3.baseHexColor || p3.hexColor);
        [
          [1,1,1],
          [2,1,1],
          [1,2,1],
          [1,1,2]
        ].forEach(ratios => {
          const avgHex = mixColors([hex1, hex2, hex3], ratios);
          const avgLab = hexToLab(avgHex);
          const delta = DeltaE.getDeltaE00(
            { L: targetLab[0], A: targetLab[1], B: targetLab[2] },
            { L: avgLab[0], A: avgLab[1], B: avgLab[2] }
          );
          if (delta <= threshold) {
            recipes.push({
              paints: [p1, p2, p3],
              ratios,
              avgHex,
              delta
            });
          }
        });
      }
    }
  }

  recipes.sort((a, b) => a.delta - b.delta);
  return recipes.slice(0, limit);
}

const RecipesTab = ({ paint, paints }) => {
  const [recipes, setRecipes] = useState(null);

  useEffect(() => {
    const cacheKey = `paintforge_recipe_${paint.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setRecipes(JSON.parse(cached));
    } else {
      setRecipes(null); // Show loading state
      // Run calculation asynchronously
      setTimeout(() => {
        const topRecipes = getRecipeCombinations(paint, paints, 15, 10);
        setRecipes(topRecipes);
        localStorage.setItem(cacheKey, JSON.stringify(topRecipes));
        // Log the top N recipes to the console
        console.log('Top Recipe Suggestions:', topRecipes.map(recipe => ({
          names: recipe.paints.map((p, i) => `${p.name} (${recipe.ratios[i]})`).join(' + '),
          avgHex: recipe.avgHex,
          delta: recipe.delta
        })));
      }, 0);
    }
  }, [paint, paints]);

  return (
    <div>
      <div className="text-base font-semibold text-gray-900 mb-2">Recipe Suggestions</div>
      {recipes === null ? (
        <div className="text-gray-500">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="text-gray-500">No recipe combinations found within threshold.</div>
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe, idx) => (
            <div key={idx} className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 px-3 py-2">
              <div className="flex items-center">
                {recipe.paints.map((p, i) => (
                  <React.Fragment key={p.id}>
                    <div className="w-12 h-12 rounded mr-2 border flex items-center justify-center" style={{ background: p.hexColor }}>
                      <span className="text-xs font-bold text-gray-900 bg-white bg-opacity-70 rounded px-1 py-0.5">{recipe.ratios[i]}</span>
                    </div>
                    {i < recipe.paints.length - 1 && (
                      <span className="mx-1 font-bold text-gray-600">+</span>
                    )}
                  </React.Fragment>
                ))}
                <span className="mx-2 font-bold text-gray-600">=</span>
                <div className="w-12 h-12 rounded border" style={{ background: recipe.avgHex }} />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="text-sm text-gray-900 font-medium">
                  {recipe.paints.map((p, i) => `${p.name} (${recipe.ratios[i]})`).join(' + ')}
                </div>
                <div className="text-xs text-gray-500">
                  ΔE {recipe.delta.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesTab;