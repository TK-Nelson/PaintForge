// src/utils/colorMixing.js
import mixbox from 'mixbox';

// Convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Convert RGB to hex
const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Mix two colors using Mixbox
export const mixPaints = (color1, color2, ratio = 0.5) => {
  try {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) {
      throw new Error('Invalid color format');
    }
    
    // Use Mixbox for realistic paint mixing
    const mixed = mixbox.lerp(
      `rgb(${rgb1.r}, ${rgb1.g}, ${rgb1.b})`,
      `rgb(${rgb2.r}, ${rgb2.g}, ${rgb2.b})`,
      ratio
    );
    
    // Convert back to hex
    const rgbMatch = mixed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch.map(Number);
      return rgbToHex(r, g, b);
    }
    
    return color1; // Fallback
  } catch (error) {
    console.error('Mixbox error:', error);
    // Fallback to simple RGB mixing
    return simpleColorMix(color1, color2, ratio);
  }
};

// Fallback simple mixing
const simpleColorMix = (color1, color2, ratio) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
  
  return rgbToHex(r, g, b);
};