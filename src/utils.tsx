export const rgbaToHex = (color: string) => {
  const rgb = color.match(/\d+(\.\d+)?/g);

  if (!rgb) return;

  const alpha = rgb[3] || '';

  let hex = (parseInt(rgb[0]) | 1 << 8).toString(16).slice(1) +
            (parseInt(rgb[1]) | 1 << 8).toString(16).slice(1) +
            (parseInt(rgb[2]) | 1 << 8).toString(16).slice(1);

  let a = alpha !== '' ? (parseFloat(alpha) * 255) | 1 << 8 : 1;

  return '#' + hex + a.toString(16).slice(1);
}