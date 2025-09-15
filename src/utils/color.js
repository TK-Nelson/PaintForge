import convert from 'color-convert';

// Lighten a hex color by a percent (0.0-1.0)
export function lighten(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + Math.round(255 * percent);
  let g = ((num >> 8) & 0x00FF) + Math.round(255 * percent);
  let b = (num & 0x0000FF) + Math.round(255 * percent);
  r = Math.min(255, r);
  g = Math.min(255, g);
  b = Math.min(255, b);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// Darken a hex color by a percent (0.0-1.0)
export function darken(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) * (1 - percent);
  let g = ((num >> 8) & 0x00FF) * (1 - percent);
  let b = (num & 0x0000FF) * (1 - percent);
  r = Math.max(0, Math.round(r));
  g = Math.max(0, Math.round(g));
  b = Math.max(0, Math.round(b));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// Metallic gradient for metallic paints
export function makeMetallicGradient(hex) {
  const light = lighten(hex, 0.4);
  const dark = darken(hex, 0.4);
  return `linear-gradient(135deg, ${hex} 0%, ${light} 40%, ${hex} 60%, ${dark} 100%)`;
}

// Shade gradient for shade paints (vertical, lighter top, darker bottom)
export function makeShadeGradient(hex) {
  const light = lighten(hex, 0.25);
  const dark = darken(hex, 0.25);
  return `linear-gradient(to bottom, ${light}, ${hex}, ${dark})`;
}

// Convert hex to LAB color
export function hexToLab(hex) {
  // Remove hash if present
  hex = hex.replace('#', '');
  // Convert to RGB
  const rgb = [
    parseInt(hex.substring(0,2), 16),
    parseInt(hex.substring(2,4), 16),
    parseInt(hex.substring(4,6), 16)
  ];
  // Convert to LAB
  return convert.rgb.lab(rgb);
}