// ─── Client-side image colour analysis ───────────────────────────────────────
// Reads pixel data from the image via Canvas API — no server/Supabase needed.

export interface AnalysisResult {
  seasonId: string;      // e.g. 'soft-autumn'
  skinToneId: string;    // e.g. 'medium-warm'
  bodyShape: string;     // default 'hourglass' (user can override in quiz)
  avgR: number;
  avgG: number;
  avgB: number;
}

/** Sample a 120×120 region from the centre of the image */
function samplePixels(img: HTMLImageElement): { r: number; g: number; b: number } {
  const canvas = document.createElement('canvas');
  const size   = 120;
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  // Draw centre crop
  const sx = (img.naturalWidth  - size) / 2;
  const sy = (img.naturalHeight - size) / 2;
  ctx.drawImage(img, Math.max(0, sx), Math.max(0, sy), size, size, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  let sumR = 0, sumG = 0, sumB = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue; // skip transparent
    sumR += data[i]; sumG += data[i + 1]; sumB += data[i + 2];
    count++;
  }
  return count > 0
    ? { r: sumR / count, g: sumG / count, b: sumB / count }
    : { r: 180, g: 140, b: 110 };
}

/** Determine season from average skin colour */
function detectSeason(r: number, g: number, b: number): { seasonId: string; skinToneId: string } {
  const lightness = (r + g + b) / 3;
  // Warm = red/yellow dominant; cool = blue dominant
  const warmScore = (r - b) + (g - b) * 0.5;
  const isLight   = lightness > 175;
  const isMedium  = lightness >= 120 && lightness <= 175;
  const isDark    = lightness < 120;
  const isWarm    = warmScore > 20;

  if (isLight && isWarm)    return { seasonId: 'light-spring',  skinToneId: 'fair-warm' };
  if (isLight && !isWarm)   return { seasonId: 'light-summer',  skinToneId: 'fair-cool' };
  if (isMedium && isWarm)   return { seasonId: 'soft-autumn',   skinToneId: 'medium-warm' };
  if (isMedium && !isWarm)  return { seasonId: 'true-summer',   skinToneId: 'medium-cool' };
  if (isDark && isWarm)     return { seasonId: 'true-autumn',   skinToneId: 'deep-warm' };
  return                           { seasonId: 'deep-winter',   skinToneId: 'deep-cool' };
}

export function analyzeImage(file: File): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const { r, g, b } = samplePixels(img);
        URL.revokeObjectURL(url);
        const { seasonId, skinToneId } = detectSeason(r, g, b);
        resolve({ seasonId, skinToneId, bodyShape: 'hourglass', avgR: r, avgG: g, avgB: b });
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}
