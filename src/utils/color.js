import convert from 'color-convert';

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